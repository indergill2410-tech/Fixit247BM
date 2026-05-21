import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

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
  // AI-generated fields passed from client after analysis
  aiUrgencyScore: z.number().int().min(0).max(100).optional(),
  aiConfidenceScore: z.number().int().min(0).max(100).optional(),
  complexity: z.enum(['SIMPLE', 'MEDIUM', 'COMPLEX']).default('MEDIUM'),
  leadPrice: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = CreateJobSchema.parse(body);

    // Get customer profile
    const customerProfile = await db.customerProfile.findUnique({
      where: { userId: session.id },
    });

    if (!customerProfile) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    const job = await db.$transaction(async (tx) => {
      const newJob = await tx.job.create({
        data: {
          customerId: customerProfile.id,
          title: data.title,
          description: data.description,
          category: data.category as any,
          isEmergency: data.isEmergency,
          priority: data.priority as any,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          addressId: data.addressId,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
          preferredTime: data.preferredTime,
          mediaUrls: data.mediaUrls,
          voiceNoteUrl: data.voiceNoteUrl,
          complexity: data.complexity as any,
          leadPrice: data.leadPrice,
          status: 'OPEN',
        },
      });

      // Record job creation event
      await tx.jobEvent.create({
        data: {
          jobId: newJob.id,
          type: 'CREATED',
          actorId: session.id,
          actorRole: 'CUSTOMER',
          metadata: { urgencyScore: data.aiUrgencyScore, confidenceScore: data.aiConfidenceScore },
        },
      });

      // Update customer job count
      await tx.customerProfile.update({
        where: { id: customerProfile.id },
        data: { jobsPosted: { increment: 1 } },
      });

      return newJob;
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid job data', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const isTradie = session.role === 'TRADIE';
    const isCustomer = session.role === 'CUSTOMER';

    let whereClause: Record<string, unknown> = {};

    if (isCustomer) {
      const cp = await db.customerProfile.findUnique({ where: { userId: session.id } });
      if (!cp) return NextResponse.json({ jobs: [] });
      whereClause = { customerId: cp.id };
    } else if (isTradie) {
      // Tradies see open jobs matching their trades
      whereClause = { status: 'OPEN' };
    }

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where: whereClause as any,
        include: {
          address: true,
          aiInsight: { select: { urgencyScore: true, confidenceScore: true, suggestedTitle: true } },
          _count: { select: { claims: true } },
        },
        orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: offset,
      }),
      db.job.count({ where: whereClause as any }),
    ]);

    return NextResponse.json({ jobs, total, limit, offset });
  } catch (err) {
    console.error('[GET /api/jobs]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
