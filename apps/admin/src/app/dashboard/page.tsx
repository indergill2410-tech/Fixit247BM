import type { Metadata } from 'next';
import { PageHeader, StatsGrid } from '@fixit247/ui';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and key metrics"
      />
      <StatsGrid cols={4}>
        <StatCard title="Total Users" value="1,284" delta="+48 this week" icon="👥" />
        <StatCard title="Active Jobs" value="127" delta="32 emergency" icon="🔧" />
        <StatCard title="Revenue (MTD)" value="$92,400" delta="AUD" icon="💰" />
        <StatCard title="Pending Verifications" value="14" delta="Tradies awaiting review" icon="🔒" />
      </StatsGrid>
    </AdminShell>
  );
}
