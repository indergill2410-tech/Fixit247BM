import type { Metadata } from 'next';
import { PageHeader, StatsGrid } from '@fixit247/ui';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';

export const metadata: Metadata = { title: 'Tradie Dashboard' };

export default function TradieDashboardPage() {
  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="My Dashboard"
        description="Track your jobs, earnings, and availability"
      />
      <StatsGrid cols={4}>
        <StatCard title="Active Jobs" value="3" delta="2 urgent" icon="🔧" />
        <StatCard title="This Month" value="$8,640" delta="AUD earned" icon="💰" />
        <StatCard title="Avg Rating" value="4.9" delta="Based on 47 reviews" icon="⭐" />
        <StatCard title="Completion Rate" value="98%" delta="Last 90 days" icon="✅" />
      </StatsGrid>
    </DashboardShell>
  );
}
