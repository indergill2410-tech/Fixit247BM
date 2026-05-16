import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const Schema = z.object({
  status: z.enum(['EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  etaMinutes: z.number().int().positive().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Valid transitions per role
const TRADIE_TRANSITIONS: Record<string, string[]> = {
  CLAIMED: ['EN_ROUTE', 'CANCELLED'],
  EN_ROUTE: ['ARRIVED', 'CANCELLED'],
  ARRIVED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
};
const ADMIN_TRANSITIONS = Object.keys(TRADIE_TRANSITIONS);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id: jobId } = await params;
    const body = await req.json();
    const { status: newStatus, etaMinutes, metadata } = Schema.parse(body);

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { status: true, tradieId: true, customerId: true },
    });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const isTradie = session.role === 'TRADIE' && job.tradieId === session.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.role);

    if (!isTradie && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate transition
    const allowedNext = isAdmin ? ADMIN_TRANSITIONS : (TRADIE_TRANSITIONS[job.status] ?? []);
    if (!allowedNext.includes(newStatus)) {
      return NextResponse.json({
        error: `Cannot transition from ${job.status} to ${newStatus}`,
      }, { status: 422 });
    }

    const updatedJob = await db.$transaction(async (tx) => {
      const updated = await tx.job.update({
        where: { id: jobId },
        data: {
          status: newStatus as never,
          ...(newStatus === 'COMPLETED' ? { completedAt: new Date() } : {}),
        },
      });

      // Record job event
      await tx.jobEvent.create({
        data: {
          jobId,
          type: `JOB_${newStatus}` as never,
          actorId: session.id,
          actorRole: session.role as never,
          metadata: { ...(metadata ?? {}), ...(etaMinutes ? { etaMinutes } : {}) } as never,
        },
      });

      return updated;
    });

    return NextResponse.json({ job: updatedJob });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[PATCH /api/jobs/:id/status]', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
