'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge } from '@fixit247/ui';
import { FxIcon } from '@/components/ui/fx-icon';

interface OfferJob {
  id: string;
  title: string;
  category: string;
  budgetMin: number | null;
  budgetMax: number | null;
  isEmergency: boolean;
  createdAt: string;
  address: { suburb: string; state: string; postcode: string } | null;
}

interface Offer {
  id: string;
  matchScore: number;
  expiresAt: string;
  job: OfferJob;
}

const CATEGORY_ICONS: Record<string, string> = {
  PLUMBING: 'droplets',
  ELECTRICAL: 'zap',
  CARPENTRY: 'hammer',
  LOCKSMITH: 'lock',
  HVAC: 'wind',
  HANDYMAN: 'wrench',
};

function iconForCategory(category: string): string {
  return CATEGORY_ICONS[category] ?? 'wrench';
}

function formatBudget(job: OfferJob): string {
  if (job.budgetMin && job.budgetMax) return `$${job.budgetMin}–$${job.budgetMax}`;
  if (job.budgetMin) return `From $${job.budgetMin}`;
  if (job.budgetMax) return `Up to $${job.budgetMax}`;
  return 'Quote required';
}

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(expiresAt).getTime() - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, new Date(expiresAt).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const expired = remaining <= 0;

  return (
    <span
      className={
        'inline-flex items-center gap-1 text-xs font-medium ' +
        (expired ? 'text-red-500' : minutes < 2 ? 'text-amber-500' : 'text-foreground-muted')
      }
    >
      <FxIcon name="clock" size={12} />
      {expired ? 'Expired' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
    </span>
  );
}

export function TradieOffersFeed() {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs/offers', { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const json = (await res.json()) as { offers: Offer[] };
      if (mounted.current) setOffers(json.offers ?? []);
    } catch {
      if (mounted.current && offers === null) setOffers([]);
    }
  }, [offers]);

  useEffect(() => {
    mounted.current = true;
    load();
    const id = setInterval(load, 20000);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const respond = useCallback(async (offer: Offer, action: 'accept' | 'decline') => {
    setPending((p) => ({ ...p, [offer.id]: true }));
    setOffers((prev) => (prev ? prev.filter((o) => o.id !== offer.id) : prev));
    try {
      const res = await fetch(`/api/jobs/${offer.job.id}/${action}`, { method: 'POST' });
      if (!res.ok) throw new Error('failed');
      toast.success(action === 'accept' ? `Accepted "${offer.job.title}"` : `Declined "${offer.job.title}"`);
    } catch {
      toast.error(`Could not ${action} job. Please try again.`);
      setOffers((prev) => (prev ? [offer, ...prev] : [offer]));
    } finally {
      setPending((p) => {
        const next = { ...p };
        delete next[offer.id];
        return next;
      });
    }
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card dark:bg-white/[0.03] dark:border-white/[0.07]">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <FxIcon name="siren" size={18} className="text-brand-500" />
          <h2 className="text-base font-semibold text-foreground">Live job offers</h2>
        </div>
        {offers && offers.length > 0 && (
          <Badge variant="warning">{offers.length}</Badge>
        )}
      </div>

      <div className="p-5">
        {offers === null ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-background-alt" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="py-10 text-center">
            <FxIcon name="bell" size={28} className="mx-auto text-foreground-subtle" />
            <p className="mt-2 text-sm font-medium text-foreground-muted">
              No offers right now — stay online to receive jobs
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => {
              const isPending = pending[offer.id];
              return (
                <div
                  key={offer.id}
                  className="rounded-xl border border-border bg-background-elevated p-4 transition-opacity"
                  style={{ opacity: isPending ? 0.5 : 1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-500">
                      <FxIcon name={iconForCategory(offer.job.category)} size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-foreground">{offer.job.title}</p>
                        {offer.job.isEmergency && <Badge variant="emergency">EMERGENCY</Badge>}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
                        {offer.job.address && (
                          <span className="inline-flex items-center gap-1">
                            <FxIcon name="mapPin" size={12} />
                            {offer.job.address.suburb}, {offer.job.address.state}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <FxIcon name="dollar" size={12} />
                          {formatBudget(offer.job)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-brand-500">
                          <FxIcon name="star" size={12} />
                          {Math.round(offer.matchScore)}% match
                        </span>
                        <Countdown expiresAt={offer.expiresAt} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => respond(offer, 'accept')}
                      disabled={isPending}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => respond(offer, 'decline')}
                      disabled={isPending}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
