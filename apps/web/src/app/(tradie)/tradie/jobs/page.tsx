import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { TradieJobFeed } from '@/components/features/jobs/tradie-job-feed';

export const metadata: Metadata = { title: 'Available Jobs' };

export default async function TradieJobsPage() {
  await requireRole('TRADIE');
  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Available Jobs"
        description="Jobs matching your trades and location"
      />
      <TradieJobFeed />
    </DashboardShell>
  );
}
