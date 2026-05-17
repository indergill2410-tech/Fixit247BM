'use client';

import { useState, useEffect } from 'react';

const ACTIVITIES = [
  { trade: 'Painter', suburb: 'Norwood, SA', action: 'claimed' },
  { trade: 'Plumber', suburb: 'Pyrmont, NSW', action: 'claimed' },
  { trade: 'Roofer', suburb: 'Docklands, VIC', action: 'claimed' },
  { trade: 'Electrician', suburb: 'Bondi, NSW', action: 'completed' },
  { trade: 'Locksmith', suburb: 'Melbourne CBD', action: 'claimed' },
  { trade: 'HVAC Tech', suburb: 'Brisbane CBD', action: 'completed' },
  { trade: 'Plumber', suburb: 'Chatswood, NSW', action: 'completed' },
  { trade: 'Pest Controller', suburb: 'Gold Coast, QLD', action: 'claimed' },
  { trade: 'Glazier', suburb: 'Fremantle, WA', action: 'completed' },
  { trade: 'Electrician', suburb: 'St Kilda, VIC', action: 'claimed' },
];

function timeAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.floor(m / 60)} hr ago`;
}

type Item = typeof ACTIVITIES[number] & { addedAt: number };

export function RecentActivityFeed() {
  const [items, setItems] = useState<Item[]>(() =>
    ACTIVITIES.slice(0, 5).map((a, i) => ({ ...a, addedAt: Date.now() - i * 8 * 60 * 1000 }))
  );
  const [, tick] = useState(0);

  useEffect(() => {
    const tickInterval = setInterval(() => tick((n) => n + 1), 30000);
    const addInterval = setInterval(() => {
      const base = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      setItems((prev) => [{ ...base, addedAt: Date.now() }, ...prev.slice(0, 6)]);
    }, 10000);
    return () => { clearInterval(tickInterval); clearInterval(addInterval); };
  }, []);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Live Activity</p>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
          updated in real-time
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/4">
        {items.map((item, i) => {
          const elapsed = Math.floor((Date.now() - item.addedAt) / 1000);
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${item.action === 'completed' ? 'bg-green-500' : 'bg-brand-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">{item.trade}</span>{' '}
                  <span className="text-gray-500">{item.action} in {item.suburb}</span>
                </p>
              </div>
              <span className="shrink-0 text-xs text-gray-600">{timeAgo(elapsed)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
