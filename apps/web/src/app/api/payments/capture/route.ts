import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { releaseJobPayment } from '@fixit247/payments';
import { notify } from '@fixit247/notifications';
import { logger } from '@/lib/logger';

const Schema = z.object({ jobId: z.string().uuid() });

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json() as unknown;
    const { jobId } = Schema.parse(body);

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (job.status !== 'COMPLETED') return NextResponse.json({ error: 'Job must be completed first' }, { status: 409 });

    // Only the job's customer or an admin can release payment
    const customerProfile = session.role === 'CUSTOMER'
      ? await db.customerProfile.findUnique({ where: { userId: session.id } })
      : null;

    if (session.role === 'CUSTOMER' && customerProfile?.id !== job.customerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await releaseJobPayment(jobId);

    // Notify both parties after payment release
    const jobDetail = await db.job.findUnique({
      where: { id: jobId },
      select: {
        agreedPrice: true,
        customer: { select: { userId: true } },
        tradie: { select: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });
    const amount = String(jobDetail?.agreedPrice ?? '');
    const tradieName = jobDetail?.tradie?.user
      ? `${jobDetail.tradie.user.firstName} ${jobDetail.tradie.user.lastName}`.trim()
      : 'the tradie';
    await Promise.all([
      jobDetail?.customer?.userId
        ? notify({ userId: jobDetail.customer.userId, jobId, type: 'PAYMENT_RELEASED', data: { amount, tradieName } })
        : Promise.resolve(),
      jobDetail?.tradie?.user?.id
        ? notify({ userId: jobDetail.tradie.user.id, jobId, type: 'PAYMENT_RELEASED', data: { amount, tradieName } })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true, payoutId: result.payoutId });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    logger.error('[POST /api/payments/capture]', err);
    return NextResponse.json({ error: 'Failed to release payment' }, { status: 500 });
  }
}
