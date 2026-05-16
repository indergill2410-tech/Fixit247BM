import type { Metadata } from 'next';
import { PageHeader, StatsGrid } from '@fixit247/ui';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { RecentJobsList } from '@/components/features/jobs/recent-jobs-list';

export const metadata: Metadata = { title: 'Dashboard' };

export default function CustomerDashboardPage() {
  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Dashboard"
        description="Manage your jobs and track progress"
      />
      <StatsGrid cols={4}>
        <StatCard title="Active Jobs" value="2" delta="+1 this week" icon="🔧" />
        <StatCard title="Completed" value="14" delta="+3 this month" icon="✅" />
        <StatCard title="Total Spent" value="$4,280" delta="AUD" icon="💳" />
        <StatCard title="Avg Rating Given" value="4.8" delta="⭐ out of 5" icon="⭐" />
      </StatsGrid>
      <div className="mt-8">
        <RecentJobsList />
      </div>
    </DashboardShell>
  );
}
