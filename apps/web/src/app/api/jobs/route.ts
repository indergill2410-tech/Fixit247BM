import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { rateLimit, rateLimitByUser, rateLimitResponse, LIMITS } from '@/lib/api/rate-limit';
import { matchAndDispatch } from '@fixit247/matching';
import { logger } from '@/lib/logger';

// ── Lead price by trade (server-side authoritative) ───────────────────────────
const LEAD_PRICE: Record<string, number> = {
  CLEANING: 5,
  GENERAL_MAINTENANCE: 5,
  PEST_CONTROL: 10,
  LOCKSMITH: 10,
  LANDSCAPING: 10,
  PAINTING: 10,
  APPLIANCE_REPAIR: 10,
  PLUMBING: 15,
  CARPENTRY: 15,
  PLASTERING: 15,
  TILING: 15,
  ELECTRICAL: 20,
  GLAZING: 20,
  HVAC: 25,
  ROOFING: 30,
  OTHER: 10,
};

const CreateJobSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(10),
  category: z.string(),
  isEmergency: z.boolean().default(false),
  priority: z.enum(['STANDARD', 'URGENT', 'EMERGENCY']).default('STANDARD'),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  addressId: z.string().uuid().optional(),
  scheduledFor: z.string().datetime().optional(),
  preferredTime: z.string().optional(),
  mediaUrls: z.array(z.string().url()).default([]),
  voiceNoteUrl: z.string().url().optional(),
  // AI-generated hints from client — validated but not trusted for money
  aiUrgencyScore: z.number().int().min(0).max(100).optional(),
  aiConfidenceScore: z.number().int().min(0).max(100).optional(),
  complexity: z.enum(['SIMPLE', 'MEDIUM', 'COMPLEX']).default('MEDIUM'),
  // leadPrice is NOT accepted from the client — computed server-side
  // Optional promo/coupon code applied at booking time
  promoCode: z.string().min(1).max(50).optional(),
});

export async function POST(req: NextRequest) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  try {
    // IP-level guard (before heavy logic) to stop flood
    const ipRl = await rateLimit(req, LIMITS.api);
    if (!ipRl.success) return rateLimitResponse(ipRl);

    // Per-user rate limit: 10 job creations per hour
    const userRl = rateLimitByUser(session.id, LIMITS.jobsCreate);
    if (!userRl.success) return rateLimitResponse(userRl);

    const body = await req.json() as unknown;
    const data = CreateJobSchema.parse(body);

    // Compute lead price server-side — never trust the browser value
    const leadPrice = LEAD_PRICE[data.category] ?? 10;

    const customerProfile = await db.customerProfile.findUnique({
      where: { userId: session.id },
    });
    if (!customerProfile) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    // Validate optional promo code (static lookup — no DB round-trip)
    const PROMO_CODES: Partial<Record<string, { discountPercent: number; description: string }>> = {
      'FIRST20':     { discountPercent: 20, description: '20% off your first job' },
      'WELCOME10':   { discountPercent: 10, description: '10% off for new customers' },
      'EMERGENCY15': { discountPercent: 15, description: '15% off emergency callouts' },
    };

    let promoDiscount: { discountPercent: number; description: string } | null = null;
    if (data.promoCode) {
      const normalised = data.promoCode.trim().toUpperCase();
      promoDiscount = PROMO_CODES[normalised] ?? null;
      if (!promoDiscount) {
        return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
      }
    }

    // Verify the submitted address belongs to this user before linking it to the job.
    if (data.addressId) {
      const addr = await db.address.findFirst({ where: { id: data.addressId, userId: session.id } });
      if (!addr) {
        return NextResponse.json({ error: 'Address not found' }, { status: 404 });
      }
    }

    // Idempotency guard: a double-clicked submit or a network retry can fire the
    // same POST twice. If this customer already created an identical job in the
    // last 30s, return that one instead of creating a duplicate.
    const recentDuplicate = await db.job.findFirst({
      where: {
        customerId: customerProfile.id,
        title: data.title,
        category: data.category as never,
        createdAt: { gte: new Date(Date.now() - 30_000) },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (recentDuplicate) {
      return NextResponse.json({ job: recentDuplicate, deduplicated: true }, { status: 200 });
    }

    const job = await db.$transaction(async (tx) => {
      const newJob = await tx.job.create({
        data: {
          customerId:   customerProfile.id,
          title:        data.title,
          description:  data.description,
          category:     data.category as never,
          isEmergency:  data.isEmergency,
          priority:     data.priority as never,
          budgetMin:    data.budgetMin,
          budgetMax:    data.budgetMax,
          addressId:    data.addressId,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
          preferredTime: data.preferredTime,
          mediaUrls:    data.mediaUrls,
          voiceNoteUrl: data.voiceNoteUrl,
          complexity:   data.complexity as never,
          leadPrice,
          status: 'OPEN',
        },
      });

      await tx.jobEvent.create({
        data: {
          jobId:     newJob.id,
          type:      'CREATED',
          actorId:   session.id,
          actorRole: 'CUSTOMER',
          metadata:  { urgencyScore: data.aiUrgencyScore, confidenceScore: data.aiConfidenceScore },
        },
      });

      await tx.customerProfile.update({
        where: { id: customerProfile.id },
        data:  { jobsPosted: { increment: 1 } },
      });

      return newJob;
    });

    // Fire-and-forget: trigger matching engine — never blocks job creation
    void matchAndDispatch(job).catch((err: unknown) => {
      logger.error('Matching engine failed', { jobId: job.id, error: String(err) });
    });

    return NextResponse.json({
      job,
      ...(promoDiscount && {
        promoApplied: {
          discountPercent: promoDiscount.discountPercent,
          description: promoDiscount.description,
        },
      }),
    }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid job data', details: err.errors }, { status: 400 });
    }
    logger.error('[POST /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(req.url);
    const status   = searchParams.get('status');
    const category = searchParams.get('category');
    const parsedLimit  = parseInt(searchParams.get('limit') ?? '20', 10);
    const limit        = isNaN(parsedLimit) ? 20 : Math.min(parsedLimit, 50);
    const parsedOffset = parseInt(searchParams.get('offset') ?? '0', 10);
    const offset       = isNaN(parsedOffset) ? 0 : Math.max(0, parsedOffset);

    const isTradie   = session.role === 'TRADIE';
    const isCustomer = session.role === 'CUSTOMER';

    let whereClause: Record<string, unknown> = {};

    if (isCustomer) {
      const cp = await db.customerProfile.findUnique({ where: { userId: session.id } });
      if (!cp) return NextResponse.json({ jobs: [] });
      whereClause = { customerId: cp.id };
    } else if (isTradie) {
      whereClause = { status: 'OPEN' };
    }

    if (status)   whereClause.status   = status;
    if (category) whereClause.category = category;

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where:   whereClause as never,
        include: {
          address:  true,
          aiInsight: { select: { urgencyScore: true, confidenceScore: true, suggestedTitle: true } },
          _count:   { select: { claims: true } },
        },
        orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
        take:    limit,
        skip:    offset,
      }),
      db.job.count({ where: whereClause as never }),
    ]);

    return NextResponse.json({ jobs, total, limit, offset });
  } catch (err) {
    logger.error('[GET /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
