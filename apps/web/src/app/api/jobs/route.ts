import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { rankTradies } from '@fixit247/matching';
import type { TradieCandidate, JobRequirements } from '@fixit247/matching';

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
});

export async function POST(req: NextRequest) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const data = CreateJobSchema.parse(body);

    // Compute lead price server-side — never trust the browser value
    const leadPrice = LEAD_PRICE[data.category] ?? 10;

    const customerProfile = await db.customerProfile.findUnique({
      where: { userId: session.id },
    });
    if (!customerProfile) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
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

    // ── Matching (non-fatal: never fails job creation) ──────────────────────
    try {
      await runMatching(job, customerProfile.id);
    } catch (matchErr) {
      console.error('[POST /api/jobs] matching failed (non-fatal):', matchErr);
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid job data', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

async function runMatching(
  job: { id: string; category: string; isEmergency: boolean; priority: string; budgetMin: unknown; budgetMax: unknown; scheduledFor: Date | null; addressId: string | null },
  customerId: string,
): Promise<void> {
  if (!job.addressId) return; // No location → can't match

  const address = await db.address.findUnique({ where: { id: job.addressId } });
  if (!address?.latitude || !address?.longitude) return;

  // Candidate query — all verified available tradies
  const tradieProfiles = await db.tradieProfile.findMany({
    where: { verificationStatus: 'VERIFIED', isAvailable: true },
    select: {
      id: true,
      userId: true,
      trades: true,
      serviceRadiusKm: true,
      isEmergencyAvailable: true,
      trustScore: true,
      avgRating: true,
      totalReviews: true,
      completionRate: true,
      cancellationRate: true,
      responseTimeMinutes: true,
    },
  });

  const tradieIds = tradieProfiles.map((t) => t.id);
  const realtimeRows = await db.tradieRealtimeStatus.findMany({
    where: { tradieId: { in: tradieIds } },
    select: {
      tradieId: true,
      onlineStatus: true,
      activeJobCount: true,
      currentLatitude: true,
      currentLongitude: true,
    },
  });

  const realtimeMap = new Map(realtimeRows.map((r) => [r.tradieId, r]));

  const candidates: TradieCandidate[] = [];
  for (const tp of tradieProfiles) {
    const rt = realtimeMap.get(tp.id);
    if (!rt?.currentLatitude || !rt?.currentLongitude) continue;
    candidates.push({
      tradieId:             tp.id,
      userId:               tp.userId,
      trades:               tp.trades as string[],
      latitude:             Number(rt.currentLatitude),
      longitude:            Number(rt.currentLongitude),
      trustScore:           Number(tp.trustScore),
      avgRating:            Number(tp.avgRating),
      totalReviews:         tp.totalReviews,
      completionRate:       Number(tp.completionRate),
      cancellationRate:     Number(tp.cancellationRate),
      responseTimeMinutes:  tp.responseTimeMinutes ?? 30,
      activeJobCount:       rt.activeJobCount,
      isEmergencyAvailable: tp.isEmergencyAvailable,
      isOnline:             rt.onlineStatus !== 'OFFLINE',
      onlineStatus:         rt.onlineStatus as string,
      serviceRadiusKm:      tp.serviceRadiusKm,
      verificationStatus:   'VERIFIED',
    });
  }

  const jobReqs: JobRequirements = {
    jobId:      job.id,
    category:   job.category,
    isEmergency: job.isEmergency,
    priority:   job.priority as 'STANDARD' | 'URGENT' | 'EMERGENCY',
    location:   { latitude: Number(address.latitude), longitude: Number(address.longitude) },
    suburb:     address.suburb,
    state:      address.state,
    budgetMin:  job.budgetMin != null ? Number(job.budgetMin) : undefined,
    budgetMax:  job.budgetMax != null ? Number(job.budgetMax) : undefined,
    scheduledFor: job.scheduledFor ?? undefined,
    customerId,
  };

  const { ranked } = rankTradies(jobReqs, candidates);
  const top3 = ranked.slice(0, 3);
  if (top3.length === 0) return;

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (job.isEmergency ? 3 : 10));

  await db.$transaction([
    ...top3.map((r) =>
      db.jobMatchingQueue.create({
        data: {
          jobId:       job.id,
          tradieId:    r.tradieId,
          batchNumber: 1,
          matchScore:  r.scoreBreakdown.totalScore,
          distanceKm:  r.scoreBreakdown.distanceKm,
          status:      'PENDING',
          sentAt:      new Date(),
          expiresAt,
        },
      }),
    ),
    db.jobEvent.create({
      data: {
        jobId:    job.id,
        type:     'OFFER_SENT',
        metadata: { matchedTradies: top3.map((r) => r.tradieId), batchNumber: 1 },
      },
    }),
  ]);
}

export async function GET(req: NextRequest) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(req.url);
    const status   = searchParams.get('status');
    const category = searchParams.get('category');
    const limit    = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset   = parseInt(searchParams.get('offset') ?? '0');

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
    console.error('[GET /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
