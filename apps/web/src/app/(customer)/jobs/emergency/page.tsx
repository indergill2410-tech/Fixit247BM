import type { Metadata } from 'next';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { EmergencyQuickPost } from '@/components/features/jobs/emergency-quick-post';

export const metadata: Metadata = { title: 'Emergency Help' };

export default async function EmergencyPage() {
  await requireOnboarding();
  return (
    <DashboardShell role="CUSTOMER">
      <EmergencyQuickPost />
    </DashboardShell>
  );
}
