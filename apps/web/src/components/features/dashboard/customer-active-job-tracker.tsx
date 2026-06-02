'use client';

import { useEffect, useState } from 'react';
import { FxIcon } from '@/components/ui/fx-icon';

interface TrackingLocation {
  lat: number;
  lng: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: string;
}

interface TrackingResponse {
  location: TrackingLocation | null;
  reason?: string;
}

interface CustomerActiveJobTrackerProps {
  jobId: string;
}

export function CustomerActiveJobTracker({ jobId }: CustomerActiveJobTrackerProps) {
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch(`/api/tracking/${jobId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('tracking failed');
        const json = (await res.json()) as TrackingResponse;
        if (active) {
          setData(json);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }

    void poll();
    const interval = setInterval(() => void poll(), 15_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [jobId]);

  if (error || !data || !data.location) {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm text-foreground-subtle">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground-subtle/40" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-foreground-subtle" />
        </span>
        Locating tradie…
      </div>
    );
  }

  const { speed, timestamp } = data.location;
  const updatedAgo = Math.max(0, Math.round((Date.now() - new Date(timestamp).getTime()) / 1000));
  // Rough ETA heuristic when speed is available (speed in m/s); fall back to "en route".
  const speedKmh = speed ? Math.round(speed * 3.6) : null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-background-alt p-4">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
          Live
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-foreground-muted">
        <FxIcon name="truck" size={16} className="text-brand-500" />
        <span>
          Tradie is on the move
          {speedKmh ? <span className="text-foreground-subtle"> · {speedKmh} km/h</span> : null}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-foreground-subtle">
        <FxIcon name="clock" size={16} />
        <span>Updated {updatedAgo < 60 ? `${updatedAgo}s` : `${Math.round(updatedAgo / 60)}m`} ago</span>
      </div>
    </div>
  );
}
