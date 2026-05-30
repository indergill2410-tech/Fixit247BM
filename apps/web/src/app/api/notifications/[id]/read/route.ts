import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    const { id } = await params;

    const isAll = id === 'all';

    if (isAll) {
      await db.notification.updateMany({
        where: { userId: session.id, readAt: null },
        data: { readAt: new Date(), status: 'READ' },
      });
    } else {
      await db.notification.updateMany({
        where: { id, userId: session.id, readAt: null },
        data: { readAt: new Date(), status: 'READ' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('[PATCH /api/notifications/:id/read]', err);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
