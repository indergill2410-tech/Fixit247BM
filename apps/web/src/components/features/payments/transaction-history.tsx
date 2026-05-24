'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Gift, AlertCircle } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

interface CreditEntry {
  id: string;
  type: string;
  credits: number;
  balanceAfter: number;
  description: string;
  createdAt: string | Date;
}

interface TransactionHistoryProps {
  entries: CreditEntry[];
  isLoading?: boolean;
  className?: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PURCHASE:            { icon: TrendingUp,   color: 'text-green-600',  label: 'Purchase' },
  JOB_DEDUCTION:       { icon: TrendingDown, color: 'text-red-500',    label: 'Job Claimed' },
  BONUS:               { icon: Gift,          color: 'text-purple-600', label: 'Bonus' },
  REFUND:              { icon: TrendingUp,    color: 'text-brand-400',  label: 'Refund' },
  ADMIN_ADJUSTMENT:    { icon: AlertCircle,   color: 'text-orange-600', label: 'Admin Adjustment' },
  REFERRAL:            { icon: Gift,          color: 'text-pink-600',   label: 'Referral' },
  SUBSCRIPTION_CREDIT: { icon: TrendingUp,   color: 'text-brand-600',  label: 'Subscription' },
};

export function TransactionHistory({ entries, isLoading, className }: TransactionHistoryProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-gray-100 bg-gray-50 py-10 text-center', className)}>
        <p className="text-3xl mb-2">📋</p>
        <p className="text-sm text-gray-500">No credit transactions yet</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white', className)}>
      {entries.map((entry) => {
        const config = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.PURCHASE;
        const Icon = config.icon;
        const isPositive = entry.credits > 0;

        return (
          <div key={entry.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100', config.color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100'))}>
              <Icon size={16} className={config.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{entry.description}</p>
              <p className="text-xs text-gray-400">
                {config.label} · {new Date(entry.createdAt).toLocaleDateString('en-AU')}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className={cn('text-sm font-bold', isPositive ? 'text-green-600' : 'text-red-500')}>
                {isPositive ? '+' : ''}{entry.credits}
              </p>
              <p className="text-xs text-gray-400">{entry.balanceAfter} bal</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
