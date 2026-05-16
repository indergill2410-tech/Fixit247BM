import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

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
    const body = await req.json();
    const data = AcceptSchema.parse(body);

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Tradie profile not found' }, { status: 404 });

    const job = await db.job.findUnique({ where: { id: jobId } });
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

      return { claim, job: updatedJob };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/jobs/[id]/accept]', err);
    return NextResponse.json({ error: 'Failed to accept job' }, { status: 500 });
  }
}
