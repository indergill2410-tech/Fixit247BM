import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: jobId } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = typeof body.reason === 'string' ? body.reason : undefined;

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    await db.$transaction([
      db.jobMatchingQueue.updateMany({
        where: { jobId, tradieId: tradieProfile.id, status: 'SENT' },
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
    console.error('[POST /api/jobs/[id]/decline]', err);
    return NextResponse.json({ error: 'Failed to decline job' }, { status: 500 });
  }
}
