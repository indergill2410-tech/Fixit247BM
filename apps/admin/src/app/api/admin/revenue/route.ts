import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // First day of the month, 5 months back (gives a 6-month inclusive window).
    const now = new Date();
    const seriesStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalRevenue,
      monthRevenue,
      pendingPayouts,
      recentPayments,
      subscriptionCounts,
      disputeCount,
      seriesPayments,
    ] = await Promise.all([
      db.payment.aggregate({ _sum: { platformFee: true }, where: { status: 'RELEASED' } }),
      db.payment.aggregate({ _sum: { platformFee: true }, where: { status: 'RELEASED', createdAt: { gte: thirtyDaysAgo } } }),
      db.payout.aggregate({ _sum: { amount: true }, where: { status: { in: ['PENDING', 'PROCESSING'] } } }),
      db.payment.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, amount: true, platformFee: true, status: true, createdAt: true, jobId: true },
      }),
      db.subscription.groupBy({ by: ['tier'], _count: { id: true }, where: { status: 'ACTIVE' } }),
      db.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      db.payment.findMany({
        where: { status: 'RELEASED', createdAt: { gte: seriesStart } },
        select: { platformFee: true, createdAt: true },
      }),
    ]);

    // Build a 6-month platform-fee series, oldest → newest.
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyRevenue.push({
        month: d.toLocaleDateString('en-AU', { month: 'short' }),
        revenue: 0,
      });
    }
    for (const p of seriesPayments) {
      const created = new Date(p.createdAt);
      const idx = (created.getFullYear() - seriesStart.getFullYear()) * 12 + (created.getMonth() - seriesStart.getMonth());
      const bucket = monthlyRevenue[idx];
      if (bucket) {
        bucket.revenue += Number(p.platformFee ?? 0);
      }
    }

    return NextResponse.json({
      totalRevenuePlatform: Number(totalRevenue._sum.platformFee ?? 0),
      monthRevenuePlatform: Number(monthRevenue._sum.platformFee ?? 0),
      pendingPayoutsTotal: Number(pendingPayouts._sum.amount ?? 0),
      recentPayments,
      subscriptionCounts,
      openDisputeCount: disputeCount,
      monthlyRevenue,
    });
  } catch (err) {
    logger.error('[GET /api/admin/revenue]', err);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}
