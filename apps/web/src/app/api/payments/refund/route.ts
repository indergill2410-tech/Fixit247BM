import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { z } from 'zod';
import { initiateRefund } from '@fixit247/payments';

const Schema = z.object({
  jobId: z.string().uuid(),
  reason: z.string().min(5).max(500),
  amount: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = Schema.parse(body);

    const result = await initiateRefund({
      jobId: data.jobId,
      reason: data.reason,
      amount: data.amount,
      requestedBy: session.id,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    console.error('[POST /api/payments/refund]', err);
    return NextResponse.json({ error: 'Failed to initiate refund' }, { status: 500 });
  }
}
