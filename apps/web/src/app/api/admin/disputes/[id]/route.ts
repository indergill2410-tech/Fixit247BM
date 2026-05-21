import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const UpdateSchema = z.object({
  status: z.enum(['UNDER_REVIEW', 'AWAITING_EVIDENCE', 'MEDIATION', 'RESOLVED_CUSTOMER', 'RESOLVED_TRADIE', 'RESOLVED_SPLIT', 'CLOSED', 'ESCALATED']).optional(),
  adminNotes: z.string().optional(),
  resolution: z.string().optional(),
  refundAmount: z.number().min(0).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    const dispute = await db.dispute.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true, title: true, status: true, description: true, createdAt: true, completedAt: true,
            payment: { select: { id: true, amount: true, status: true, stripePaymentIntentId: true } },
          },
        },
      },
    });

    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });

    const chatMessages = await db.message.findMany({
      where: { jobId: dispute.jobId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    return NextResponse.json({ dispute, chatMessages });
  } catch (err) {
    console.error('[GET /api/admin/disputes/:id]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;
    const data = UpdateSchema.parse(await req.json());

    const isResolved = data.status && ['RESOLVED_CUSTOMER', 'RESOLVED_TRADIE', 'RESOLVED_SPLIT', 'CLOSED'].includes(data.status);

    const dispute = await db.dispute.update({
      where: { id },
      data: {
        ...data,
        refundAmount: data.refundAmount ?? undefined,
        resolvedBy: isResolved ? session.id : undefined,
        resolvedAt: isResolved ? new Date() : undefined,
      } as never,
    });

    await db.adminAuditLog.create({
      data: { adminId: session.id, action: 'DISPUTE_UPDATED', entity: 'Dispute', entityId: id, metadata: data as never },
    });

    return NextResponse.json({ dispute });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[PATCH /api/admin/disputes/:id]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
