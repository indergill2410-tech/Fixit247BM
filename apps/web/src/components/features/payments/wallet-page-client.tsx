'use client';

import * as React from 'react';
import { WalletCard } from './wallet-card';
import { CreditPurchaseModal } from './credit-purchase-modal';
import { TransactionHistory } from './transaction-history';

interface WalletData {
  balance: { balance: number; lifetimeEarned: number; lifetimeSpent: number };
  packages: { id: string; name: string; credits: number; priceAud: string | number; bonusCredits: number; isPopular: boolean }[];
  subscription?: { tier: string; status: string; currentPeriodEnd?: string } | null;
}

interface HistoryEntry {
  id: string;
  type: string;
  credits: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export function WalletPageClient({ userId }: { userId: string }) {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showPurchase, setShowPurchase] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const [balRes, histRes] = await Promise.all([
        fetch('/api/credits/balance'),
        fetch('/api/credits/history?limit=20'),
      ]);
      if (balRes.ok) setWalletData(await balRes.json());
      if (histRes.ok) setHistory((await histRes.json()).entries ?? []);
      setIsLoading(false);
    };
    void load();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-gray-200" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}
        </div>
      </div>
    );
  }

  const balance = walletData?.balance.balance ?? 0;
  const isLowCredit = balance < 3;

  return (
    <div className="space-y-6">
      {isLowCredit && walletData && (
        <div className="flex flex-col gap-3 rounded-xl border border-yellow-300 bg-yellow-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-yellow-500" aria-hidden="true">&#9888;</span>
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Low credit balance:</span> You have{' '}
              <span className="font-bold">{balance}</span> credit{balance === 1 ? '' : 's'} left.
              You need at least <span className="font-semibold">5 credits</span> to accept new jobs
              on the <span className="font-semibold">FREE plan</span>.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setShowPurchase(true)}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors"
            >
              Buy credits
            </button>
            <a
              href="/tradie/subscription"
              className="rounded-lg border border-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-100 transition-colors"
            >
              Upgrade plan
            </a>
          </div>
        </div>
      )}

      {walletData && (
        <WalletCard
          balance={walletData.balance.balance}
          lifetimeEarned={walletData.balance.lifetimeEarned}
          lifetimeSpent={walletData.balance.lifetimeSpent}
          subscriptionTier={walletData.subscription?.tier}
          onPurchaseClick={() => { setShowPurchase(true); }}
        />
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Transaction history</h2>
        <TransactionHistory entries={history} />
      </div>

      {walletData && (
        <CreditPurchaseModal
          open={showPurchase}
          onClose={() => { setShowPurchase(false); }}
          packages={walletData.packages}
        />
      )}
    </div>
  );
}
