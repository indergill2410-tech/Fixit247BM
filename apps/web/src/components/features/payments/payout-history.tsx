'use client';

import * as React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

interface Payout {
  id: string;
  amount: number | string;
  status: string;
  jobId?: string | null;
  processedAt?: string | Date | null;
  createdAt: string | Date;
  isHeld: boolean;
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PENDING:    { icon: Clock,         color: 'text-yellow-600', label: 'Pending' },
  PROCESSING: { icon: Clock,         color: 'text-brand-400',  label: 'Processing' },
  PAID:       { icon: CheckCircle,   color: 'text-green-600',  label: 'Paid' },
  FAILED:     { icon: XCircle,       color: 'text-red-500',    label: 'Failed' },
  HELD:       { icon: AlertTriangle, color: 'text-orange-600', label: 'On Hold' },
  CANCELLED:  { icon: XCircle,       color: 'text-gray-400',   label: 'Cancelled' },
};

export function PayoutHistory({ payouts, isLoading }: { payouts: Payout[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 py-10 text-center">
        <p className="text-3xl mb-2">💸</p>
        <p className="text-sm text-gray-500">No payouts yet — complete a job to receive payment</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {payouts.map((payout) => {
        const config = STATUS_CONFIG[payout.status] ?? STATUS_CONFIG.PENDING;
        const Icon = config.icon;

        return (
          <div key={payout.id} className="flex items-center gap-3 px-4 py-4">
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100')}>
              <Icon size={18} className={config.color} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">${Number(payout.amount).toFixed(2)} AUD</p>
                {payout.isHeld && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">Held</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {config.label} · {new Date(payout.createdAt).toLocaleDateString('en-AU')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
