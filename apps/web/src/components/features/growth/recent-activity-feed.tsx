'use client';

import { useState, useEffect } from 'react';

const ACTIVITIES = [
  { trade: 'Plumber', suburb: 'Pyrmont, NSW', action: 'claimed', emoji: '🔧' },
  { trade: 'Electrician', suburb: 'Bondi, NSW', action: 'completed', emoji: '⚡' },
  { trade: 'Locksmith', suburb: 'Melbourne CBD', action: 'claimed', emoji: '🔑' },
  { trade: 'HVAC Tech', suburb: 'Brisbane CBD', action: 'completed', emoji: '❄️' },
  { trade: 'Roofer', suburb: 'Docklands, VIC', action: 'claimed', emoji: '🏠' },
  { trade: 'Plumber', suburb: 'Chatswood, NSW', action: 'completed', emoji: '🔧' },
  { trade: 'Pest Controller', suburb: 'Gold Coast, QLD', action: 'claimed', emoji: '🐛' },
  { trade: 'Glazier', suburb: 'Fremantle, WA', action: 'completed', emoji: '🪟' },
  { trade: 'Electrician', suburb: 'St Kilda, VIC', action: 'claimed', emoji: '⚡' },
  { trade: 'Painter', suburb: 'Norwood, SA', action: 'claimed', emoji: '🎨' },
];

function timeAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

type Item = typeof ACTIVITIES[number] & { addedAt: number };

export function RecentActivityFeed() {
  const [items, setItems] = useState<Item[]>(() =>
    ACTIVITIES.slice(0, 5).map((a, i) => ({ ...a, addedAt: Date.now() - i * 7 * 60 * 1000 }))
  );
  const [, tick] = useState(0);

  useEffect(() => {
    const tickInterval = setInterval(() => { tick((n) => n + 1); }, 30000);
    const addInterval = setInterval(() => {
      const base = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      setItems((prev) => [{ ...base, addedAt: Date.now() }, ...prev.slice(0, 6)]);
    }, 9000);
    return () => { clearInterval(tickInterval); clearInterval(addInterval); };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-glass">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Live Activity</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          LIVE
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/[0.04]">
        {items.map((item, i) => {
          const elapsed = Math.floor((Date.now() - item.addedAt) / 1000);
          const isCompleted = item.action === 'completed';
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 transition-colors">
              <span className="text-base shrink-0">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">
                  <span className="font-semibold">{item.trade}</span>
                  {' '}
                  <span className={`text-xs ${isCompleted ? 'text-emerald-500' : 'text-brand-500'}`}>
                    {isCompleted ? 'completed job' : 'on the way'}
                  </span>
                </p>
                <p className="text-[11px] text-gray-600">{item.suburb}</p>
              </div>
              <span className="shrink-0 text-[11px] text-gray-700">{timeAgo(elapsed)}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.05] px-4 py-2.5 text-center">
        <p className="text-[10px] text-gray-700">Showing live job activity across Australia</p>
      </div>
    </div>
  );
}
