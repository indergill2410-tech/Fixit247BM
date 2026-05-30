import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import type { Prisma } from '@fixit247/database';
import { z } from 'zod';

const ResolveSchema = z.object({
  resolution: z.enum(['RESOLVED_SAFE', 'RESOLVED_FRAUD', 'ESCALATED']),
  notes: z.string().optional(),
  suspendUser: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ flagId: string }> }) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const { flagId } = await params;

    const flag = await db.fraudFlag.findUnique({
      where: { id: flagId },
    });
    if (!flag) return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    return NextResponse.json({ flag });
  } catch (err) {
    console.error('[GET /api/admin/fraud/:flagId]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ flagId: string }> }) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const { flagId } = await params;
    const { resolution, notes, suspendUser } = ResolveSchema.parse(await req.json());

    const flag = await db.fraudFlag.findUnique({ where: { id: flagId }, select: { userId: true } });
    if (!flag) return NextResponse.json({ error: 'Flag not found' }, { status: 404 });

    const ops: Prisma.PrismaPromise<unknown>[] = [
      db.fraudFlag.update({
        where: { id: flagId },
        data: { status: resolution as never, reviewedBy: session.id, reviewedAt: new Date(), resolvedAt: new Date() },
      }),
      db.adminAuditLog.create({
        data: { adminId: session.id, action: `FRAUD_${resolution}`, entity: 'FraudFlag', entityId: flagId, metadata: { resolution, notes } as never },
      }),
    ];

    if (suspendUser) {
      ops.push(db.user.update({ where: { id: flag.userId }, data: { isActive: false } }));
    }

    await db.$transaction(ops);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[PATCH /api/admin/fraud/:flagId]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
