'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Zap, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';

interface Offer {
  id: string;
  matchScore: string;
  distanceKm: string | null;
  expiresAt: string | null;
  job: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    isEmergency: boolean;
    budgetMin: number | null;
    budgetMax: number | null;
    createdAt: string;
    address: {
      suburb: string;
      state: string;
      postcode: string;
    } | null;
  };
}

const PRIORITY_STYLES: Record<string, string> = {
  EMERGENCY: 'border-red-500/40 bg-red-500/8',
  URGENT:    'border-orange-500/40 bg-orange-500/8',
  STANDARD:  'border-white/10 bg-white/4',
};

const PRIORITY_BADGE: Record<string, string> = {
  EMERGENCY: 'bg-red-500/20 text-red-400',
  URGENT:    'bg-orange-500/20 text-orange-400',
  STANDARD:  'bg-gray-500/20 text-gray-400',
};

function ExpiryCountdown({ expiresAt }: { expiresAt: string | null }) {
  const [remaining, setRemaining] = React.useState('');

  React.useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setRemaining('Expired'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => { clearInterval(id); };
  }, [expiresAt]);

  if (!expiresAt) return null;
  const urgent = new Date(expiresAt).getTime() - Date.now() < 60000;
  return (
    <span className={cn('flex items-center gap-1 text-xs font-mono', urgent ? 'text-red-400' : 'text-gray-400')}>
      <Clock size={11} />
      {remaining}
    </span>
  );
}

export default function TradieOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [accepting, setAccepting] = React.useState<string | null>(null);
  const [declining, setDeclining] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    fetch('/api/jobs/offers')
      .then((r) => r.json())
      .then((json: { offers?: Offer[] }) => {
        setOffers(json.offers ?? []);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, []);

  React.useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => { clearInterval(id); };
  }, [load]);

  const handleAccept = async (offer: Offer) => {
    setAccepting(offer.id);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${offer.job.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotedPrice: (offer.job.budgetMin != null && offer.job.budgetMin > 0) ? offer.job.budgetMin : 150,
          estimatedHours: 2,
          message: 'I can help with this job.',
        }),
      });
      if (res.ok) {
        router.push(`/tradie/jobs/${offer.job.id}`);
      } else {
        const body = await res.json() as { error?: string };
        setError(body.error ?? 'Failed to accept offer');
        setAccepting(null);
      }
    } catch {
      setError('Network error — please try again');
      setAccepting(null);
    }
  };

  const handleDecline = async (offer: Offer) => {
    setDeclining(offer.id);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${offer.job.id}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Not available' }),
      });
      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o.id !== offer.id));
      } else {
        const body = await res.json() as { error?: string };
        setError(body.error ?? 'Failed to decline — please try again');
      }
    } catch {
      setError('Failed to decline — please try again');
    } finally {
      setDeclining(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Job Offers</h1>
          <p className="text-sm text-gray-500">Accept an offer to claim the job and earn credits.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading offers…
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-12 text-center">
          <CheckCircle2 size={40} className="mx-auto mb-4 text-gray-600" />
          <p className="font-medium text-white">No pending offers</p>
          <p className="mt-1 text-sm text-gray-500">New jobs matching your trades will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={cn(
                'rounded-2xl border p-5 transition-all',
                PRIORITY_STYLES[offer.job.priority] ?? PRIORITY_STYLES['STANDARD'],
              )}
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {offer.job.isEmergency && (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                        <AlertTriangle size={10} />
                        Emergency
                      </span>
                    )}
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', PRIORITY_BADGE[offer.job.priority] ?? PRIORITY_BADGE['STANDARD'])}>
                      {offer.job.priority}
                    </span>
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-gray-400">
                      {offer.job.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-white leading-tight">{offer.job.title}</h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">{offer.job.description}</p>
                </div>
                <ExpiryCountdown expiresAt={offer.expiresAt} />
              </div>

              {/* Meta */}
              <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-400">
                {offer.job.address && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {offer.job.address.suburb}, {offer.job.address.state}
                    {offer.distanceKm && ` · ${Number(offer.distanceKm).toFixed(1)} km away`}
                  </span>
                )}
                {(offer.job.budgetMin ?? offer.job.budgetMax) && (
                  <span className="flex items-center gap-1">
                    <Zap size={11} />
                    {offer.job.budgetMin && offer.job.budgetMax
                      ? `$${offer.job.budgetMin}–$${offer.job.budgetMax}`
                      : offer.job.budgetMin
                      ? `From $${offer.job.budgetMin}`
                      : `Up to $${offer.job.budgetMax}`}
                  </span>
                )}
                <span className="ml-auto">
                  Match: {Math.round(Number(offer.matchScore) * 100)}%
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  disabled={declining === offer.id || !!accepting}
                  onClick={() => { void handleDecline(offer); }}
                >
                  {declining === offer.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  disabled={accepting === offer.id || !!declining}
                  onClick={() => { void handleAccept(offer); }}
                >
                  {accepting === offer.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Accept Job
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
