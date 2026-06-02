'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FxIcon } from '@/components/ui/fx-icon';

export function CreditsChip() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/credits/balance', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json && typeof json.balance === 'number') setBalance(json.balance);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated px-3 py-1.5 text-sm">
      <FxIcon name="zap" size={14} className="text-brand-500" />
      <span className="font-medium text-foreground">
        {balance === null ? '—' : balance} credits
      </span>
      <Link
        href="/tradie/wallet"
        className="ml-1 font-medium text-brand-500 hover:text-brand-600"
      >
        Top up
      </Link>
    </div>
  );
}
