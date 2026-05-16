'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, Button } from '@fixit247/ui';
import { RefreshCw, Plus, CheckCircle2, X, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  resolvedAt?: string;
}

interface AlertsData {
  alerts: Alert[];
  stats: { active: number; critical: number; warnings: number };
}

type StatusFilter = 'ACTIVE' | 'DISMISSED' | 'ALL';

const SEVERITY_BORDER: Record<string, string> = {
  CRITICAL: 'border-l-red-500',
  HIGH: 'border-l-orange-400',
  MEDIUM: 'border-l-yellow-400',
  INFO: 'border-l-blue-400',
};

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  INFO: 'bg-blue-100 text-blue-700',
};

const ALERT_TYPES = [
  'FRAUD_SPIKE',
  'PAYMENT_FAILURE',
  'SYSTEM_OVERLOAD',
  'TRADIE_SHORTAGE',
  'SUSPICIOUS_ACTIVITY',
  'MANUAL_ALERT',
] as const;

const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] as const;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function CreateAlertPanel({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [type, setType] = useState<string>(ALERT_TYPES[0]);
  const [severity, setSeverity] = useState<string>('MEDIUM');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, severity, title: title.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? 'Failed to create alert');
      }
      toast.success('Alert created');
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create alert');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Create Alert</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {ALERT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Alert title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Alert details…"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AlertsPage() {
  const [data, setData] = useState<AlertsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ACTIVE');
  const [showCreate, setShowCreate] = useState(false);
  const [dismissing, setDismissing] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/alerts');
      if (!res.ok) throw new Error('Failed to load alerts');
      setData(await res.json());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 15_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  async function dismissAlert(id: string) {
    setDismissing(id);
    try {
      const res = await fetch(`/api/admin/alerts/${id}/dismiss`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to dismiss alert');
      toast.success('Alert dismissed');
      await fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to dismiss');
    } finally {
      setDismissing(null);
    }
  }

  const filtered = (data?.alerts ?? []).filter((a) => {
    if (statusFilter === 'ACTIVE') return a.status === 'ACTIVE';
    if (statusFilter === 'DISMISSED') return a.status !== 'ACTIVE';
    return true;
  });

  const STATUS_TABS: StatusFilter[] = ['ACTIVE', 'DISMISSED', 'ALL'];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Platform Alerts</h1>
            <span
              className={`flex h-2.5 w-2.5 rounded-full ${
                autoRefresh ? 'animate-pulse bg-green-500' : 'bg-gray-300'
              }`}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Real-time platform monitoring · auto-refresh every 15s
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          </Button>
          <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
            <Plus size={14} />
            Create Alert
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))
        ) : (
          <>
            <StatCard title="Active Alerts" value={data?.stats.active ?? '—'} icon="🔔" />
            <StatCard title="Critical" value={data?.stats.critical ?? '—'} icon="🚨" />
            <StatCard title="Warnings" value={data?.stats.warnings ?? '—'} icon="⚠️" />
          </>
        )}
      </div>

      {/* Create panel */}
      {showCreate && (
        <CreateAlertPanel onClose={() => setShowCreate(false)} onCreated={fetchData} />
      )}

      {/* Status filter */}
      <div className="mb-4 flex gap-1">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-400">No alerts in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border-l-4 bg-white p-4 shadow-sm ${
                SEVERITY_BORDER[alert.severity] ?? 'border-l-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        SEVERITY_BADGE[alert.severity] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(alert.createdAt)}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{alert.title}</p>
                  <p className="mt-0.5 text-sm text-gray-600">{alert.message}</p>
                  {alert.resolvedAt && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 size={12} />
                      Resolved {timeAgo(alert.resolvedAt)}
                    </div>
                  )}
                </div>
                {alert.status === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    disabled={dismissing === alert.id}
                    className="shrink-0"
                  >
                    {dismissing === alert.id ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      'Dismiss'
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
