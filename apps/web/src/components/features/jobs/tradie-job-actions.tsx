'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';

interface TradieJobActionsProps {
  jobId: string;
  status: string;
  isEmergency: boolean;
  budgetMin?: number | null;
  budgetMax?: number | null;
  hasAccepted: boolean;
}

export function TradieJobActions({ jobId, status, isEmergency, budgetMax, budgetMin, hasAccepted }: TradieJobActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [quotedPrice, setQuotedPrice] = React.useState<string>(String(budgetMax ?? budgetMin ?? ''));

  const callApi = async (url: string, method: string, body?: object) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (status === 'OPEN' && !hasAccepted) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        <h3 className="mb-3 font-semibold text-white">Submit your quote</h3>
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-400">Your quoted price (AUD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={quotedPrice}
              onChange={(e) => { setQuotedPrice(e.target.value); }}
              className="w-full rounded-xl border border-white/15 bg-white/6 py-3 pl-7 pr-3 text-sm text-white placeholder-gray-600 focus:border-brand-400 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => callApi(`/api/jobs/${jobId}/decline`, 'POST', { reason: 'Not available' })}
            disabled={loading}
            className="flex-1 gap-2"
          >
            <XCircle size={16} />
            Decline
          </Button>
          <Button
            onClick={() => callApi(`/api/jobs/${jobId}/accept`, 'POST', { quotedPrice: Number(quotedPrice) })}
            disabled={loading || !quotedPrice}
            className={cn('flex-1 gap-2', isEmergency && 'bg-red-600 hover:bg-red-700')}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {isEmergency ? 'Accept Emergency' : 'Accept Job'}
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'CLAIMED') {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/8 p-5">
        <p className="mb-3 font-semibold text-green-400">You've accepted this job!</p>
        <Button
          onClick={() => callApi(`/api/jobs/${jobId}/status`, 'PATCH', { status: 'IN_PROGRESS' })}
          disabled={loading}
          className="w-full gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Wrench size={16} />}
          Mark as Started
        </Button>
      </div>
    );
  }

  if (status === 'IN_PROGRESS') {
    return (
      <div className="rounded-2xl border border-brand-500/30 bg-brand-500/8 p-5">
        <p className="mb-3 font-semibold text-brand-400">Job in progress</p>
        <Button
          onClick={() => callApi(`/api/jobs/${jobId}/status`, 'PATCH', { status: 'COMPLETED' })}
          disabled={loading}
          className="w-full gap-2 bg-green-600 hover:bg-green-700"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          Mark as Completed
        </Button>
      </div>
    );
  }

  return null;
}
