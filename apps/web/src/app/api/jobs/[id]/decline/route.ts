import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: jobId } = await params;
    const raw = await (req.json() as Promise<unknown>).catch(() => ({}) as unknown);
    const body = (typeof raw === 'object' && raw !== null) ? raw as Record<string, unknown> : {};
    const reason = typeof body.reason === 'string' ? body.reason : undefined;

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    await db.$transaction([
      db.jobMatchingQueue.updateMany({
        where: { jobId, tradieId: tradieProfile.id, status: { in: ['PENDING', 'SENT'] } },
        data: { status: 'DECLINED', respondedAt: new Date(), declineReason: reason },
      }),
      db.jobEvent.create({
        data: {
          jobId,
          type: 'OFFER_DECLINED',
          actorId: session.id,
          actorRole: 'TRADIE',
          metadata: { reason },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('[POST /api/jobs/[id]/decline]', err);
    return NextResponse.json({ error: 'Failed to decline job' }, { status: 500 });
  }
}
