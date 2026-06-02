import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const PatchSchema = z.object({
  action: z.enum(['CANCEL', 'FORCE_COMPLETE']),
  reason: z.string().min(1),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const job = await db.job.findUnique({
      where: { id },
      include: {
        customer: {
          include: { user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } } },
        },
        tradie: {
          include: { user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } } },
        },
        address: true,
        payment: true,
        events: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        claims: {
          include: {
            tradie: {
              include: { user: { select: { firstName: true, lastName: true } } },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ job });
  } catch (err) {
    logger.error('[GET /api/admin/jobs/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = PatchSchema.parse(await req.json());

    const job = await db.job.findUnique({ where: { id }, select: { status: true } });
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const terminalStatuses = ['COMPLETED', 'CANCELLED'];
    if (terminalStatuses.includes(job.status)) {
      return NextResponse.json({ error: 'Job is already in a terminal status' }, { status: 400 });
    }

    if (body.action === 'CANCEL') {
      const [updated] = await db.$transaction([
        db.job.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: body.reason,
          },
        }),
        db.jobEvent.create({
          data: {
            jobId: id,
            type: 'JOB_CANCELLED',
            actorId: session.id,
            actorRole: session.role as never,
            metadata: { reason: body.reason, forcedBy: 'admin' } as never,
          },
        }),
        db.adminAuditLog.create({
          data: {
            adminId: session.id,
            action: 'JOB_FORCE_CANCELLED',
            entity: 'Job',
            entityId: id,
            metadata: { reason: body.reason } as never,
          },
        }),
      ]);
      return NextResponse.json({ job: updated });
    }

    if (body.action === 'FORCE_COMPLETE') {
      const [updated] = await db.$transaction([
        db.job.update({
          where: { id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        }),
        db.jobEvent.create({
          data: {
            jobId: id,
            type: 'JOB_COMPLETED',
            actorId: session.id,
            actorRole: session.role as never,
            metadata: { reason: body.reason, forcedBy: 'admin' } as never,
          },
        }),
        db.adminAuditLog.create({
          data: {
            adminId: session.id,
            action: 'JOB_FORCE_COMPLETED',
            entity: 'Job',
            entityId: id,
            metadata: { reason: body.reason } as never,
          },
        }),
      ]);
      return NextResponse.json({ job: updated });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    logger.error('[PATCH /api/admin/jobs/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
