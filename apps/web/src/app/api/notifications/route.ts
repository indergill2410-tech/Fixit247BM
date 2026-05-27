import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;
  try {
    const unreadOnly = req.nextUrl.searchParams.get('unread') === 'true';
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '30'), 100);
    const cursor = req.nextUrl.searchParams.get('cursor');

    const notifications = await db.notification.findMany({
      where: {
        userId: session.id,
        ...(unreadOnly ? { readAt: null } : {}),
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await db.notification.count({
      where: { userId: session.id, readAt: null },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      nextCursor: notifications.length === limit ? notifications[notifications.length - 1]?.createdAt.toISOString() : null,
    });
  } catch (err) {
    logger.error('[GET /api/notifications]', err);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
