import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { WalletPageClient } from '@/components/features/payments/wallet-page-client';

export const metadata: Metadata = { title: 'My Wallet' };

export default async function WalletPage() {
  const session = await requireRole('TRADIE');
  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Wallet"
        description="Manage your credits, purchase bundles, and view transaction history"
      />
      <WalletPageClient userId={session.id} />
    </DashboardShell>
  );
}
