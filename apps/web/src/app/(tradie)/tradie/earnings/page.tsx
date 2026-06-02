import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { PayoutHistory } from '@/components/features/payments/payout-history';
import { FxIcon } from '@/components/ui/fx-icon';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'Earnings' };

export default async function EarningsPage() {
  const session = await requireRole('TRADIE');

  const tradieProfile = await db.tradieProfile.findUnique({
    where: { userId: session.id },
    select: { id: true, totalEarnings: true, totalJobsCompleted: true },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentPayouts, pendingPayouts] = await Promise.all([
    db.payout.findMany({
      where: { tradieId: tradieProfile?.id ?? '', createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    db.payout.aggregate({
      _sum: { amount: true },
      where: { tradieId: tradieProfile?.id ?? '', status: { in: ['PENDING', 'PROCESSING'] } },
    }),
  ]);

  const monthEarnings = recentPayouts
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const payoutsForDisplay = recentPayouts.map((p) => ({
    ...p,
    amount: Number(p.amount),
    processedAt: p.processedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Earnings"
        description="Track your income and payout history"
      />

      <StatsGrid cols={4}>
        <StatCard
          title="Total Earned"
          value={`$${Number(tradieProfile?.totalEarnings ?? 0).toLocaleString()}`}
          delta="AUD lifetime"
          icon={<FxIcon name="dollar" size={18} />}
        />
        <StatCard
          title="This Month"
          value={`$${monthEarnings.toLocaleString()}`}
          delta="Last 30 days"
          trend="up"
          icon={<FxIcon name="trendUp" size={18} />}
        />
        <StatCard
          title="Pending"
          value={`$${Number(pendingPayouts._sum.amount ?? 0).toFixed(2)}`}
          delta="Awaiting release"
          icon={<FxIcon name="clock" size={18} />}
        />
        <StatCard
          title="Jobs Completed"
          value={String(tradieProfile?.totalJobsCompleted ?? 0)}
          delta="All time"
          icon={<FxIcon name="checkCircle" size={18} />}
        />
      </StatsGrid>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent payouts</h2>
        <PayoutHistory payouts={payoutsForDisplay} />
      </div>
    </DashboardShell>
  );
}
