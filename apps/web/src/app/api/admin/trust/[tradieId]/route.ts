import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const OverrideSchema = z.object({
  score: z.number().int().min(0).max(100),
  reason: z.string().min(1).max(500),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ tradieId: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { tradieId } = await params;

    const [profile, history] = await Promise.all([
      db.tradieProfile.findUnique({
        where: { id: tradieId },
        select: {
          id: true, trustScore: true, avgRating: true, totalJobsCompleted: true,
          verificationStatus: true, responseTimeMinutes: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
      db.trustScoreHistory.findMany({
        where: { tradieId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    if (!profile) return NextResponse.json({ error: 'Tradie not found' }, { status: 404 });
    return NextResponse.json({ profile, history });
  } catch (err) {
    console.error('[GET /api/admin/trust/:tradieId]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tradieId: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { tradieId } = await params;
    const { score, reason } = OverrideSchema.parse(await req.json());

    const profile = await db.tradieProfile.findUnique({ where: { id: tradieId }, select: { trustScore: true } });
    if (!profile) return NextResponse.json({ error: 'Tradie not found' }, { status: 404 });

    await db.$transaction([
      db.tradieProfile.update({ where: { id: tradieId }, data: { trustScore: score } }),
      db.trustScoreHistory.create({
        data: { tradieId, score, previousScore: profile.trustScore ? Math.round(Number(profile.trustScore)) : undefined, reason: `Admin override: ${reason}`, adminId: session.id },
      }),
      db.adminAuditLog.create({
        data: { adminId: session.id, action: 'TRUST_SCORE_OVERRIDE', entity: 'TradieProfile', entityId: tradieId, metadata: { score, reason } as never },
      }),
    ]);

    return NextResponse.json({ success: true, newScore: score });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[PATCH /api/admin/trust/:tradieId]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
