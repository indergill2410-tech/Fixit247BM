'use client';

import * as React from 'react';
import { Zap, Power } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

type OnlineStatus = 'ONLINE' | 'OFFLINE' | 'EMERGENCY_ONLY' | 'BUSY';

const STATUS_OPTIONS: { id: OnlineStatus; label: string; description: string; color: string }[] = [
  { id: 'OFFLINE', label: 'Offline', description: 'Not accepting jobs', color: 'text-foreground-muted' },
  { id: 'ONLINE', label: 'Available', description: 'Accepting all jobs', color: 'text-green-600 dark:text-green-400' },
  { id: 'EMERGENCY_ONLY', label: 'Emergency only', description: 'Emergency jobs only', color: 'text-red-600 dark:text-red-400' },
];

export function AvailabilityToggle() {
  const [status, setStatus] = React.useState<OnlineStatus>('OFFLINE');
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    fetch('/api/availability')
      .then((r) => r.json())
      .then((data: { status?: { onlineStatus?: OnlineStatus } }) => {
        if (active && data.status?.onlineStatus) setStatus(data.status.onlineStatus);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

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
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm dark:bg-white/[0.03]">
      <div className={cn('relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', status === 'OFFLINE' ? 'bg-background-alt' : status === 'EMERGENCY_ONLY' ? 'bg-red-500/15' : 'bg-green-500/15')}>
        {status === 'EMERGENCY_ONLY' ? (
          <Zap size={18} className="text-red-600 dark:text-red-400" />
        ) : (
          <Power size={18} className={status === 'ONLINE' ? 'text-green-600 dark:text-green-400' : 'text-foreground-muted'} />
        )}
        {status === 'ONLINE' && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold', currentOption.color)}>{currentOption.label}</p>
        <p className="text-xs text-foreground-subtle">{currentOption.description}</p>
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
                ? opt.id === 'OFFLINE' ? 'bg-background-alt text-foreground' : opt.id === 'EMERGENCY_ONLY' ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-green-500/15 text-green-600 dark:text-green-400'
                : 'text-foreground-muted hover:bg-background-alt'
            )}
          >
            {opt.label === 'Available' ? 'Online' : opt.label === 'Offline' ? 'Offline' : 'Emergency'}
          </button>
        ))}
      </div>
    </div>
  );
}
