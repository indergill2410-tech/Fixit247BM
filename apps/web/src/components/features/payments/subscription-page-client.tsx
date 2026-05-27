'use client';

import * as React from 'react';
import { SubscriptionPlans } from './subscription-plans';
import { Button } from '@fixit247/ui';
import { ExternalLink } from 'lucide-react';

interface SubData {
  subscription?: { tier: string; status: string; currentPeriodEnd?: string; cancelAtPeriodEnd?: boolean } | null;
  plans: Record<string, { name: string; priceMonthlyAud: number; features: string[]; monthlyBonusCredits: number; badgeLabel: string | null }>;
}

export function SubscriptionPageClient({ userId }: { userId: string }) {
  const [data, setData] = React.useState<SubData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPortalLoading, setIsPortalLoading] = React.useState(false);

  React.useEffect(() => {
    void fetch('/api/subscriptions').then(async (r) => {
      if (r.ok) setData(await r.json() as SubData);
      setIsLoading(false);
    });
  }, [userId]);

  const handleUpgrade = async (tier: string) => {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, stripeCustomerId: 'pending' }),
    });
    if (res.ok) window.location.reload();
  };

  const openPortal = async () => {
    setIsPortalLoading(true);
    try {
      const res = await fetch('/api/subscriptions/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (res.ok) {
        const { url } = await res.json() as { url?: string };
        if (url) window.location.href = url;
      }
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (isLoading) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-gray-100" />)}</div>;
  }

  const plans = Object.entries(data?.plans ?? {}).map(([tier, plan]) => ({ tier, ...plan }));
  const currentTier = data?.subscription?.tier ?? 'FREE';
  const sub = data?.subscription;

  return (
    <div className="space-y-8">
      {sub && sub.tier !== 'FREE' && (
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">{plans.find((p) => p.tier === sub.tier)?.name} Plan</p>
            <p className="text-xs text-gray-500">
              {sub.cancelAtPeriodEnd
                ? `Cancels on ${sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString('en-AU') : 'period end'}`
                : `Renews ${sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString('en-AU') : 'soon'}`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={openPortal} disabled={isPortalLoading} className="gap-1.5">
            <ExternalLink size={14} />
            Manage billing
          </Button>
        </div>
      )}

      <SubscriptionPlans plans={plans} currentTier={currentTier} onSelect={handleUpgrade} />

      <p className="text-center text-xs text-gray-400">
        All plans billed monthly in AUD. Cancel anytime. Prices exclude GST.
      </p>
    </div>
  );
}
