'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Zap, Power } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

type OnlineStatus = 'ONLINE' | 'OFFLINE' | 'EMERGENCY_ONLY' | 'BUSY';

const STATUS_OPTIONS: { id: OnlineStatus; label: string; description: string; color: string }[] = [
  { id: 'OFFLINE', label: 'Offline', description: 'Not accepting jobs', color: 'text-gray-500' },
  { id: 'ONLINE', label: 'Available', description: 'Accepting all jobs', color: 'text-green-600' },
  { id: 'EMERGENCY_ONLY', label: 'Emergency only', description: 'Emergency jobs only', color: 'text-red-600' },
];

export function AvailabilityToggle() {
  const [status, setStatus] = React.useState<OnlineStatus>('OFFLINE');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const updateStatus = async (newStatus: OnlineStatus) => {
    setIsUpdating(true);
    try {
      await fetch('/api/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onlineStatus: newStatus }),
      });
      setStatus(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOption = STATUS_OPTIONS.find((o) => o.id === status) ?? STATUS_OPTIONS[0];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', status === 'OFFLINE' ? 'bg-gray-100' : status === 'EMERGENCY_ONLY' ? 'bg-red-100' : 'bg-green-100')}>
        {status === 'EMERGENCY_ONLY' ? (
          <Zap size={18} className="text-red-600" />
        ) : (
          <Power size={18} className={status === 'ONLINE' ? 'text-green-600' : 'text-gray-500'} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold', currentOption.color)}>{currentOption.label}</p>
        <p className="text-xs text-gray-400">{currentOption.description}</p>
      </div>

      {/* Quick cycle button */}
      <div className="flex gap-1">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateStatus(opt.id)}
            disabled={isUpdating || status === opt.id}
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
              status === opt.id
                ? opt.id === 'OFFLINE' ? 'bg-gray-200 text-gray-700' : opt.id === 'EMERGENCY_ONLY' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            )}
          >
            {opt.label === 'Available' ? 'Online' : opt.label === 'Offline' ? 'Offline' : 'Emergency'}
          </button>
        ))}
      </div>
    </div>
  );
}
