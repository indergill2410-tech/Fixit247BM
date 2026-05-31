import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const days = Number(req.nextUrl.searchParams.get('days') ?? '30');
    const since = new Date(Date.now() - days * 86_400_000);

    const [
      jobStats, _userGrowth, revenueByDay, topTrades, tradieRetention,
      subscriptionBreakdown, emergencyStats, disputeRate,
    ] = await Promise.all([
      // Job completion funnel
      db.job.groupBy({ by: ['status'], _count: { id: true }, where: { createdAt: { gte: since } } }),

      // New users per day (last 7 days)
      db.user.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: { createdAt: { gte: new Date(Date.now() - 7 * 86_400_000) } },
      }),

      // Revenue by day
      db.payment.findMany({
        where: { status: 'RELEASED', createdAt: { gte: since } },
        select: { platformFee: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top trade categories
      db.job.groupBy({
        by: ['category'],
        _count: { id: true },
        where: { createdAt: { gte: since } },
        orderBy: { _count: { id: 'desc' } },
        take: 8,
      }),

      // Tradie retention (completed 2+ jobs)
      db.tradieProfile.count({ where: { totalJobsCompleted: { gte: 2 } } }),

      // Active subscriptions by tier
      db.subscription.groupBy({ by: ['tier'], _count: { id: true }, where: { status: 'ACTIVE' } }),

      // Emergency job demand
      db.job.count({ where: { isEmergency: true, createdAt: { gte: since } } }),

      // Dispute rate
      db.dispute.count({ where: { createdAt: { gte: since } } }),
    ]);

    // Build daily revenue map
    const revenueMap: Record<string, number> = {};
    for (const pmt of revenueByDay) {
      const day = pmt.createdAt.toISOString().slice(0, 10);
      revenueMap[day] = (revenueMap[day] ?? 0) + Number(pmt.platformFee);
    }

    const jobTotal = jobStats.reduce((s, g) => s + g._count.id, 0);
    const completedJobs = jobStats.find((g) => g.status === 'COMPLETED')?._count.id ?? 0;

    return NextResponse.json({
      period: { days, since: since.toISOString() },
      jobs: {
        total: jobTotal,
        completed: completedJobs,
        completionRate: jobTotal > 0 ? (completedJobs / jobTotal) : 0,
        byStatus: jobStats,
        emergencyCount: emergencyStats,
      },
      revenue: {
        byDay: Object.entries(revenueMap).map(([date, amount]) => ({ date, amount })),
        total: revenueByDay.reduce((s, p) => s + Number(p.platformFee), 0),
      },
      tradies: {
        retention: tradieRetention,
        topTrades: topTrades.map((t) => ({ category: t.category, count: t._count.id })),
      },
      subscriptions: subscriptionBreakdown,
      disputeRate: jobTotal > 0 ? disputeRate / jobTotal : 0,
    });
  } catch (err) {
    logger.error('[GET /api/admin/analytics]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
