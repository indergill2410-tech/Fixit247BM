import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import type { Prisma } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const ActionSchema = z.object({
  targetUserId: z.string().uuid(),
  actionType: z.enum(['WARNING', 'TEMPORARY_SUSPENSION', 'PERMANENT_SUSPENSION', 'ACCOUNT_REINSTATEMENT', 'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'PAYOUT_HOLD', 'PAYOUT_RELEASE', 'TRUST_SCORE_OVERRIDE']),
  reason: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 100);
    const cursor = req.nextUrl.searchParams.get('cursor');

    const [actions, pendingVerifications, suspendedUsers] = await Promise.all([
      db.moderationAction.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      Promise.resolve(0),
      db.user.count({ where: { isActive: false } }),
    ]);

    return NextResponse.json({ actions, pendingVerifications, suspendedUsers, total: actions.length });
  } catch (err) {
    logger.error('[GET /api/admin/moderation]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = ActionSchema.parse(await req.json());

    const ops: Prisma.PrismaPromise<unknown>[] = [
      db.moderationAction.create({
        data: { adminId: session.id, ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : null } as never,
      }),
      db.adminAuditLog.create({
        data: { adminId: session.id, action: data.actionType, entity: 'User', entityId: data.targetUserId, metadata: data.metadata as never },
      }),
    ];

    // Apply suspension/reinstatement
    if (data.actionType === 'TEMPORARY_SUSPENSION' || data.actionType === 'PERMANENT_SUSPENSION') {
      ops.push(db.user.update({ where: { id: data.targetUserId }, data: { isActive: false } }));
    } else if (data.actionType === 'ACCOUNT_REINSTATEMENT') {
      ops.push(db.user.update({ where: { id: data.targetUserId }, data: { isActive: true } }));
    }

    await db.$transaction(ops);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    logger.error('[POST /api/admin/moderation]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
