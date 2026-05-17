'use client';

import { useState, useEffect } from 'react';

const ACTIVITIES = [
  { trade: 'Plumbing', suburb: 'Parramatta', status: 'COMPLETED', emoji: '🔧', time: '3 min ago' },
  { trade: 'Electrical', suburb: 'Bondi', status: 'EN_ROUTE', emoji: '⚡', time: '7 min ago' },
  { trade: 'Locksmith', suburb: 'Melbourne CBD', status: 'CLAIMED', emoji: '🔑', time: '11 min ago' },
  { trade: 'HVAC', suburb: 'Brisbane CBD', status: 'COMPLETED', emoji: '❄️', time: '14 min ago' },
  { trade: 'Roofing', suburb: 'Perth CBD', status: 'IN_PROGRESS', emoji: '🏠', time: '19 min ago' },
  { trade: 'Plumbing', suburb: 'Chatswood', status: 'COMPLETED', emoji: '🔧', time: '23 min ago' },
  { trade: 'Electrical', suburb: 'St Kilda', status: 'EN_ROUTE', emoji: '⚡', time: '28 min ago' },
  { trade: 'Pest Control', suburb: 'Gold Coast', status: 'COMPLETED', emoji: '🐛', time: '31 min ago' },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  COMPLETED: { label: 'Completed', color: 'text-green-600' },
  EN_ROUTE: { label: 'Tradie en route', color: 'text-brand-400' },
  CLAIMED: { label: 'Tradie assigned', color: 'text-brand-600' },
  IN_PROGRESS: { label: 'In progress', color: 'text-orange-600' },
};

type ActivityItem = typeof ACTIVITIES[number];

export function RecentActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>(ACTIVITIES);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItem = { ...ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)], time: 'Just now' };
        return [newItem, ...prev.slice(0, 7)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">Live Activity</p>
        <span className="flex items-center gap-1.5 text-xs text-green-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>
      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {items.map((item, i) => {
          const status = STATUS_LABELS[item.status] ?? { label: item.status, color: 'text-gray-600' };
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.trade} &middot; {item.suburb}</p>
                <p className={`text-xs ${status.color}`}>{status.label}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
