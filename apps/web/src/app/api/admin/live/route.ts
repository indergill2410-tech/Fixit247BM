import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET() {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [activeJobs, onlineTradies, recentEvents, pendingDispatch] = await Promise.all([
      db.job.findMany({
        where: { status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] as const } },
        orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
        take: 50,
        select: {
          id: true, title: true, status: true, priority: true, isEmergency: true,
          createdAt: true, tradieId: true, customerId: true,
        },
      }),
      db.tradieRealtimeStatus.findMany({
        where: { onlineStatus: { not: 'OFFLINE' } },
        select: {
          tradieId: true, onlineStatus: true, currentLatitude: true, currentLongitude: true,
          activeJobCount: true, lastHeartbeatAt: true,
        },
      }),
      db.jobEvent.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      db.job.count({ where: { status: 'OPEN' } }),
    ]);

    return NextResponse.json({
      activeJobs,
      onlineTradieCount: onlineTradies.length,
      onlineTradies,
      recentEvents,
      pendingDispatchCount: pendingDispatch,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[GET /api/admin/live]', err);
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
