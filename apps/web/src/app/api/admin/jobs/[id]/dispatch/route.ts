import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const Schema = z.object({
  reason: z.string().optional(),
  batchSize: z.number().int().min(1).max(10).default(3),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const { id: jobId } = await params;
    const body = await req.json().catch(() => ({}));
    const { reason, batchSize } = Schema.parse(body);

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { status: true, matchingBatchNo: true },
    });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    if (!['OPEN'].includes(job.status)) {
      return NextResponse.json({ error: `Job is ${job.status} — cannot re-dispatch` }, { status: 422 });
    }

    await db.jobMatchingQueue.updateMany({
      where: { jobId, status: 'PENDING' },
      data: { status: 'EXPIRED' },
    });

    const newBatch = (job.matchingBatchNo ?? 0) + 1;

    await db.$transaction([
      db.job.update({ where: { id: jobId }, data: { status: 'OPEN' as const, matchingBatchNo: newBatch } }),
      db.jobEvent.create({
        data: {
          jobId, type: 'JOB_REDISPATCHED' as never,
          actorId: session.id, actorRole: 'ADMIN',
          metadata: { reason, newBatch, batchSize } as never,
        },
      }),
    ]);

    return NextResponse.json({ success: true, newBatch, message: `Re-dispatched as batch #${newBatch}` });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[POST /api/admin/jobs/:id/dispatch]', err);
    return NextResponse.json({ error: 'Failed to re-dispatch' }, { status: 500 });
  }
}
