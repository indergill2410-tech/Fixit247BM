'use client';

import * as React from 'react';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { Power, Zap, Clock, Loader2, Save, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@fixit247/ui/src/lib/utils';

type OnlineStatus = 'ONLINE' | 'OFFLINE' | 'EMERGENCY_ONLY' | 'BUSY' | 'AWAY';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const STATUS_OPTIONS: { id: OnlineStatus; label: string; description: string; color: string; bg: string }[] = [
  { id: 'ONLINE', label: 'Available', description: 'Accepting all new jobs', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  { id: 'EMERGENCY_ONLY', label: 'Emergency Only', description: 'Urgent jobs only', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  { id: 'OFFLINE', label: 'Offline', description: 'Not accepting jobs', color: 'text-gray-400', bg: 'bg-white/4 border-white/8' },
];

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DEFAULT_HOURS: WorkingHours[] = DAYS.map((_, i) => ({
  dayOfWeek: i,
  startTime: '08:00',
  endTime: '17:00',
  isAvailable: i >= 1 && i <= 5, // Mon–Fri by default
}));

export default function TradieAvailabilityPage() {
  const [status, setStatus] = React.useState<OnlineStatus>('OFFLINE');
  const [travelRadius, setTravelRadius] = React.useState(25);
  const [isAutoAccept, setIsAutoAccept] = React.useState(false);
  const [hours, setHours] = React.useState<WorkingHours[]>(DEFAULT_HOURS);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/availability')
      .then((r) => r.json())
      .then((data) => {
        if (data.status) {
          setStatus(data.status.onlineStatus ?? 'OFFLINE');
          setTravelRadius(data.status.travelRadiusKm ?? 25);
          setIsAutoAccept(data.status.isAutoAccept ?? false);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const updateStatus = async (newStatus: OnlineStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onlineStatus: newStatus, travelRadiusKm: travelRadius, isAutoAccept }),
      });
      if (!res.ok) throw new Error();
      setStatus(newStatus);
      toast.success(`Status updated to ${STATUS_OPTIONS.find((o) => o.id === newStatus)?.label ?? newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const toggleDay = (idx: number) => {
    setHours((prev) =>
      prev.map((h, i) => i === idx ? { ...h, isAvailable: !h.isAvailable } : h)
    );
  };

  const updateHours = (idx: number, field: 'startTime' | 'endTime', value: string) => {
    setHours((prev) =>
      prev.map((h, i) => i === idx ? { ...h, [field]: value } : h)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onlineStatus: status, travelRadiusKm: travelRadius, isAutoAccept }),
      });
      toast.success('Availability saved successfully');
    } catch {
      toast.error('Failed to save availability');
    } finally {
      setIsSaving(false);
    }
  };

  const currentOption = STATUS_OPTIONS.find((o) => o.id === status) ?? STATUS_OPTIONS[2]!;

  if (isLoading) {
    return (
      <DashboardShell role="TRADIE">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-400" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Availability"
        description="Control when you receive job requests"
        actions={
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
            Save Settings
          </Button>
        }
      />

      <StatsGrid cols={3}>
        <StatCard
          title="Current Status"
          value={currentOption.label}
          delta={currentOption.description}
          icon={status === 'ONLINE' ? '🟢' : status === 'EMERGENCY_ONLY' ? '🟡' : '⚫'}
        />
        <StatCard title="Service Radius" value={`${travelRadius} km`} delta="From your location" icon="📍" />
        <StatCard title="Auto Accept" value={isAutoAccept ? 'On' : 'Off'} delta="Automatically claim jobs" icon="⚡" />
      </StatsGrid>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Status selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power size={16} className="text-brand-400" />
              Online Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateStatus(opt.id)}
                disabled={isUpdatingStatus}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                  status === opt.id ? opt.bg : 'border-white/8 bg-white/2 hover:bg-white/4',
                  isUpdatingStatus && 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', {
                  'bg-green-500/20': opt.id === 'ONLINE',
                  'bg-amber-500/20': opt.id === 'EMERGENCY_ONLY',
                  'bg-white/8': opt.id === 'OFFLINE',
                })}>
                  {opt.id === 'EMERGENCY_ONLY' ? (
                    <Zap size={18} className="text-amber-400" />
                  ) : (
                    <Power size={18} className={opt.id === 'ONLINE' ? 'text-green-400' : 'text-gray-500'} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-semibold', status === opt.id ? opt.color : 'text-white')}>{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </div>
                {status === opt.id && (
                  <div className={cn('h-2 w-2 rounded-full', {
                    'bg-green-400': opt.id === 'ONLINE',
                    'bg-amber-400': opt.id === 'EMERGENCY_ONLY',
                    'bg-gray-500': opt.id === 'OFFLINE',
                  })} />
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={16} className="text-brand-400" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Service Radius</label>
                <span className="text-sm font-bold text-brand-400">{travelRadius} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={travelRadius}
                onChange={(e) => setTravelRadius(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-600">
                <span>5 km</span>
                <span>150 km</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 p-4">
              <div>
                <p className="text-sm font-medium text-white">Auto-Accept Jobs</p>
                <p className="text-xs text-gray-500">Automatically claim matching jobs</p>
              </div>
              <button
                onClick={() => setIsAutoAccept((p) => !p)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  isAutoAccept ? 'bg-brand-500' : 'bg-white/10',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  isAutoAccept ? 'left-5.5 translate-x-0.5' : 'left-0.5',
                )} />
              </button>
            </div>

            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
              <p className="text-xs font-semibold text-brand-400 mb-1">Tip</p>
              <p className="text-xs text-gray-500">
                Set to "Emergency Only" after hours to earn premium rates without missing urgent callouts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working hours */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-400" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-gray-500">Set your standard working hours. Jobs outside these hours will still appear but be lower priority.</p>
          <div className="space-y-2">
            {hours.map((h, idx) => (
              <div key={idx} className={cn(
                'flex items-center gap-4 rounded-xl p-3 transition-colors',
                h.isAvailable ? 'bg-white/4 border border-white/8' : 'bg-white/2 border border-white/4 opacity-60',
              )}>
                <button
                  onClick={() => toggleDay(idx)}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all',
                    h.isAvailable ? 'bg-brand-500 text-gray-900' : 'bg-white/8 text-gray-500',
                  )}
                >
                  {DAYS[idx]!.slice(0, 2)}
                </button>
                <span className="w-20 text-sm font-medium text-gray-300 shrink-0">{DAYS[idx]}</span>
                {h.isAvailable ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="time"
                      value={h.startTime}
                      onChange={(e) => updateHours(idx, 'startTime', e.target.value)}
                      className="rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-xs text-white [color-scheme:dark]"
                    />
                    <span className="text-xs text-gray-500">to</span>
                    <input
                      type="time"
                      value={h.endTime}
                      onChange={(e) => updateHours(idx, 'endTime', e.target.value)}
                      className="rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-xs text-white [color-scheme:dark]"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-gray-600">Unavailable</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
              Save Hours
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
