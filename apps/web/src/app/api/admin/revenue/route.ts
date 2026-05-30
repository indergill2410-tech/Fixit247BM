import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET() {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalRevenue,
      monthRevenue,
      pendingPayouts,
      recentPayments,
      subscriptionCounts,
      disputeCount,
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
    ]);

    return NextResponse.json({
      totalRevenuePlatform: Number(totalRevenue._sum.platformFee ?? 0),
      monthRevenuePlatform: Number(monthRevenue._sum.platformFee ?? 0),
      pendingPayoutsTotal: Number(pendingPayouts._sum.amount ?? 0),
      recentPayments,
      subscriptionCounts,
      openDisputeCount: disputeCount,
    });
  } catch (err) {
    console.error('[GET /api/admin/revenue]', err);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}
