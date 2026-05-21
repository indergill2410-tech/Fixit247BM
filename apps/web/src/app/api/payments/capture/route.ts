import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { releaseJobPayment } from '@fixit247/payments';

const Schema = z.object({ jobId: z.string().uuid() });

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
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

    return NextResponse.json({ success: true, payoutId: result.payoutId });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    console.error('[POST /api/payments/capture]', err);
    return NextResponse.json({ error: 'Failed to release payment' }, { status: 500 });
  }
}
