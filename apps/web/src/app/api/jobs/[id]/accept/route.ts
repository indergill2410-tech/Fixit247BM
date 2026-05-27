import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { notify } from '@fixit247/notifications';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const AcceptSchema = z.object({
  quotedPrice: z.number().positive(),
  estimatedHours: z.number().positive().optional(),
  message: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Only tradies can accept jobs' }, { status: 403 });
    }

    const { id: jobId } = await params;
    const body = await req.json() as unknown;
    const data = AcceptSchema.parse(body);

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Tradie profile not found' }, { status: 404 });

    // ── Subscription & credit enforcement ────────────────────────────────────
    const [subscription, wallet, activeJobCount] = await Promise.all([
      db.subscription.findUnique({ where: { userId: session.id }, select: { tier: true, status: true } }),
      db.creditsWallet.findUnique({ where: { userId: session.id }, select: { balance: true } }),
      db.job.count({ where: { tradieId: tradieProfile.id, status: { in: ['CLAIMED', 'IN_PROGRESS'] } } }),
    ]);

    const tier = (subscription?.status === 'ACTIVE' ? subscription.tier : null) ?? 'FREE';

    const ACTIVE_JOB_LIMITS: Record<string, number> = { FREE: 3, BASIC: 10, PROFESSIONAL: 999, ELITE: 999 };
    const CREDIT_COSTS: Record<string, number> = { FREE: 5, BASIC: 3, PROFESSIONAL: 2, ELITE: 0 };

    const jobLimit = ACTIVE_JOB_LIMITS[tier] ?? 3;
    if (activeJobCount >= jobLimit) {
      return NextResponse.json({
        error: `Your ${tier} plan allows a maximum of ${jobLimit} active jobs. Complete or cancel existing jobs first.`,
        upgradeUrl: '/tradie/subscription',
        activeJobs: activeJobCount,
        limit: jobLimit,
      }, { status: 402 });
    }

    const creditCost = CREDIT_COSTS[tier] ?? 5;
    const balance = Number(wallet?.balance ?? 0);
    if (creditCost > 0 && balance < creditCost) {
      return NextResponse.json({
        error: 'Insufficient credits to accept this job',
        creditsRequired: creditCost,
        creditsAvailable: balance,
        purchaseUrl: '/tradie/wallet',
        upgradeUrl: '/tradie/subscription',
      }, { status: 402 });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const job = await db.job.findUnique({
      where: { id: jobId },
      include: { customer: { select: { userId: true } } },
    });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (job.status !== 'OPEN') return NextResponse.json({ error: 'Job is no longer available' }, { status: 409 });

    const result = await db.$transaction(async (tx) => {
      // Create claim
      const claim = await tx.jobClaim.create({
        data: {
          jobId,
          tradieId: tradieProfile.id,
          quotedPrice: data.quotedPrice,
          estimatedHours: data.estimatedHours,
          message: data.message,
          isAccepted: true,
          acceptedAt: new Date(),
        },
      });

      // Update job status and assign tradie
      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          status: 'CLAIMED',
          tradieId: tradieProfile.id,
          agreedPrice: data.quotedPrice,
          claimedAt: new Date(),
        },
      });

      // Update matching queue entry
      await tx.jobMatchingQueue.updateMany({
        where: { jobId, tradieId: tradieProfile.id },
        data: { status: 'ACCEPTED', respondedAt: new Date() },
      });

      // Decline other pending offers
      await tx.jobMatchingQueue.updateMany({
        where: { jobId, tradieId: { not: tradieProfile.id }, status: 'SENT' },
        data: { status: 'DECLINED' },
      });

      // Record event
      await tx.jobEvent.create({
        data: {
          jobId,
          type: 'OFFER_ACCEPTED',
          actorId: session.id,
          actorRole: 'TRADIE',
          metadata: { quotedPrice: data.quotedPrice, tradieProfileId: tradieProfile.id },
        },
      });

      // Deduct credits if applicable
      if (creditCost > 0 && wallet) {
        await tx.creditsWallet.update({
          where: { userId: session.id },
          data: {
            balance: { decrement: creditCost },
            lifetimeSpent: { increment: creditCost },
          },
        });
      }

      return { claim, job: updatedJob };
    });

    // Notify customer that their job has been accepted
    const tradieName = (tradieProfile.businessName ?? session.firstName) || 'Your tradie';
    await notify({
      userId: job.customer.userId,
      jobId,
      type: 'JOB_ACCEPTED',
      data: { jobTitle: job.title, tradieName },
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    logger.error('[POST /api/jobs/[id]/accept]', err);
    return NextResponse.json({ error: 'Failed to accept job' }, { status: 500 });
  }
}
