import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { notify } from '@fixit247/notifications';
import { z } from 'zod';

const CreateSchema = z.object({
  jobId: z.string().uuid(),
  customerId: z.string().uuid(),
  tradieId: z.string().uuid(),
  reason: z.enum(['INCOMPLETE_WORK', 'NO_SHOW', 'PAYMENT_DISAGREEMENT', 'DAMAGE_CLAIM', 'REFUND_REQUEST', 'EMERGENCY_COMPLAINT', 'QUALITY_ISSUE', 'OTHER']),
  title: z.string().min(1),
  description: z.string().min(1),
  dueBy: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const status = req.nextUrl.searchParams.get('status');
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 100);

    const disputes = await db.dispute.findMany({
      where: { ...(status && status !== 'ALL' ? { status: status as never } : {}) },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      include: {
        job: { select: { id: true, title: true, status: true } },
      },
    });

    const counts = await db.dispute.groupBy({ by: ['status'], _count: { id: true } });
    return NextResponse.json({ disputes, counts });
  } catch (err) {
    console.error('[GET /api/admin/disputes]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = CreateSchema.parse(await req.json());

    const dispute = await db.dispute.create({
      data: {
        ...data,
        assignedTo: session.id,
        dueBy: data.dueBy ? new Date(data.dueBy) : new Date(Date.now() + 48 * 3_600_000),
      } as never,
    });

    await db.adminAuditLog.create({
      data: { adminId: session.id, action: 'DISPUTE_CREATED', entity: 'Dispute', entityId: dispute.id, metadata: { reason: data.reason } as never },
    });

    // Notify both parties about the dispute
    const job = await db.job.findUnique({
      where: { id: data.jobId },
      select: { title: true, customer: { select: { userId: true } }, tradie: { select: { userId: true } } },
    });
    if (job) {
      const notifData = { jobTitle: job.title };
      void notify({ userId: job.customer.userId, jobId: data.jobId, type: 'DISPUTE_OPENED', data: notifData });
      if (job.tradie?.userId) {
        void notify({ userId: job.tradie.userId, jobId: data.jobId, type: 'DISPUTE_OPENED', data: notifData });
      }
    }

    return NextResponse.json({ dispute }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[POST /api/admin/disputes]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
