'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import { RefreshCw, Zap, Clock, AlertTriangle, Radio, Wrench, Users, } from 'lucide-react';
import { toast } from 'sonner';

interface LiveData {
  activeJobs: {
    id: string; title: string; status: string; priority: string;
    isEmergency: boolean; suburb: string; createdAt: string;
    tradieId: string | null; customerId: string;
  }[];
  onlineTradieCount: number;
  onlineTradies: {
    tradieId: string; onlineStatus: string; activeJobCount: number; lastHeartbeatAt: string | null;
  }[];
  recentEvents: { id: string; jobId: string; type: string; createdAt: string }[];
  pendingDispatchCount: number;
  timestamp: string;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-gray-100 text-gray-700',
  MATCHING: 'bg-yellow-100 text-yellow-700',
  CLAIMED: 'bg-blue-100 text-blue-700',
  EN_ROUTE: 'bg-blue-200 text-blue-800',
  ARRIVED: 'bg-purple-100 text-purple-700',
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  return `${Math.floor(diff / 3_600_000)}h`;
}

export default function AdminLivePage() {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dispatching, setDispatching] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/live');
      if (res.ok) setData(await res.json());
    } catch {
      /* silent — auto-refreshing */
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 10s
  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  async function forceDispatch(jobId: string) {
    setDispatching(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin manual re-dispatch' }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success(`Re-dispatched as batch #${result.newBatch}`);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Re-dispatch failed');
    } finally {
      setDispatching(null);
    }
  }

  const emergencyJobs = data?.activeJobs.filter((j) => j.isEmergency) ?? [];
  const matchingJobs = data?.activeJobs.filter((j) => j.status === 'MATCHING') ?? [];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">Live Operations</h1>
            <span className={`flex h-2.5 w-2.5 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time job dispatch · {data ? `Updated ${timeAgo(data.timestamp)} ago` : '—'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh((v) => !v)}
          >
            <Radio size={14} className={autoRefresh ? 'text-green-500' : ''} />
            {autoRefresh ? 'Auto' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Active Jobs" value={data?.activeJobs.length ?? '—'} icon={<Wrench size={18} />} color="amber" />
        <StatCard title="Online Tradies" value={data?.onlineTradieCount ?? '—'} icon={<Users size={18} />} color="blue" />
        <StatCard title="Pending Dispatch" value={data?.pendingDispatchCount ?? '—'} icon={<Clock size={18} />} color="default" delta="Awaiting tradie" />
        <StatCard title="Emergency Jobs" value={emergencyJobs.length} icon={<AlertTriangle size={18} />} color="red" delta={emergencyJobs.length > 0 ? 'Needs priority' : 'All clear'} highlight={emergencyJobs.length > 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active jobs table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={16} />
              Active Jobs
              {matchingJobs.length > 0 && (
                <Badge variant="warning">{matchingJobs.length} matching</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}
              </div>
            ) : !data?.activeJobs.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No active jobs right now</p>
            ) : (
              <div className="divide-y">
                {data.activeJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {job.isEmergency && <AlertTriangle size={12} className="shrink-0 text-red-500" />}
                        <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{job.suburb} · {timeAgo(job.createdAt)} ago</p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[job.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                      {(job.status === 'MATCHING' || job.status === 'OPEN') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => forceDispatch(job.id)}
                          disabled={dispatching === job.id}
                          className="text-xs"
                        >
                          {dispatching === job.id ? <RefreshCw size={11} className="animate-spin" /> : 'Re-dispatch'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right panel: tradies + events */}
        <div className="space-y-6">
          {/* Online tradies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Online Tradies ({data?.onlineTradieCount ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}</div>
              ) : !data?.onlineTradies.length ? (
                <p className="text-sm text-muted-foreground">No tradies online</p>
              ) : (
                <div className="space-y-2">
                  {data.onlineTradies.slice(0, 8).map((t) => (
                    <div key={t.tradieId} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${t.onlineStatus === 'ONLINE' ? 'bg-green-500' : t.onlineStatus === 'EMERGENCY_ONLY' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <span className="text-xs font-medium text-foreground">{t.tradieId.slice(-8)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t.activeJobCount} job{t.activeJobCount !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent events feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock size={14} />
                Event Feed (30 min)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 animate-pulse rounded bg-muted" />)}</div>
              ) : !data?.recentEvents.length ? (
                <p className="text-xs text-muted-foreground">No events yet</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {data.recentEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground truncate max-w-[160px]">{ev.type.replace('JOB_', '')}</span>
                      <span className="shrink-0 text-muted-foreground">{timeAgo(ev.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
