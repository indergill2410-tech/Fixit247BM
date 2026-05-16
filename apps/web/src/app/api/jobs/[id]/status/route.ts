import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const StatusUpdateSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  note: z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id: jobId } = await params;
    const body = await req.json();
    const { status, note } = StatusUpdateSchema.parse(body);

    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const eventTypeMap: Record<string, string> = {
      IN_PROGRESS: 'WORK_STARTED',
      COMPLETED: 'WORK_COMPLETED',
      CANCELLED: 'CANCELLED',
    };

    const updatedJob = await db.$transaction(async (tx) => {
      const updated = await tx.job.update({
        where: { id: jobId },
        data: {
          status: status as any,
          startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
          completedAt: status === 'COMPLETED' ? new Date() : undefined,
          cancelledAt: status === 'CANCELLED' ? new Date() : undefined,
        },
      });

      await tx.jobEvent.create({
        data: {
          jobId,
          type: eventTypeMap[status] as any,
          actorId: session.id,
          actorRole: session.role as any,
          metadata: { note, previousStatus: job.status },
        },
      });

      await tx.jobStatusHistory.create({
        data: {
          jobId,
          fromStatus: job.status,
          toStatus: status as any,
          note,
          changedBy: session.id,
        },
      });

      return updated;
    });

    return NextResponse.json({ job: updatedJob });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid status', details: err.errors }, { status: 400 });
    }
    console.error('[PATCH /api/jobs/[id]/status]', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
