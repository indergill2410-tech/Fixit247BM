import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { SubscriptionPageClient } from '@/components/features/payments/subscription-page-client';

export const metadata: Metadata = { title: 'Subscription' };

export default async function SubscriptionPage() {
  const session = await requireRole('TRADIE');
  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Subscription"
        description="Choose a plan that matches your business goals"
      />
      <SubscriptionPageClient userId={session.id} />
    </DashboardShell>
  );
}
