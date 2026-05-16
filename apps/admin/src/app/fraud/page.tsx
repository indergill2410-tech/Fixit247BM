'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, Radio, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface FraudFlag {
  id: string;
  userId: string;
  type: string;
  severity: string;
  riskScore: number;
  details: Record<string, unknown>;
  status: string;
  createdAt: string;
}

interface FraudData {
  flags: FraudFlag[];
  stats: {
    total: number;
    bySeverity: { CRITICAL: number; HIGH: number; MEDIUM: number; LOW: number };
    pendingCount: number;
  };
}

type SeverityFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-blue-100 text-blue-700',
};

function riskScoreColor(score: number): string {
  if (score >= 75) return 'text-red-700';
  if (score >= 50) return 'text-orange-600';
  return 'text-yellow-600';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const SEVERITY_TABS: SeverityFilter[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function FraudPage() {
  const [data, setData] = useState<FraudData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<SeverityFilter>('ALL');
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/fraud?status=PENDING&limit=50');
      if (res.ok) setData(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 20_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  async function handleAction(id: string, resolution: 'CLEARED' | 'ESCALATED', notes: string) {
    setSubmitting(id);
    try {
      const res = await fetch(`/api/admin/fraud/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution, notes }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Action failed');
      toast.success(`Flag ${resolution.toLowerCase()} successfully`);
      setResolveId(null);
      setResolveNotes('');
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setSubmitting(null);
    }
  }

  const filteredFlags = data?.flags.filter(
    (f) => filter === 'ALL' || f.severity === filter,
  ) ?? [];

  const autoSuspendedCount = data?.flags.filter((f) => f.status === 'AUTO_SUSPENDED').length ?? 0;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Fraud Detection</h1>
            <span className={`flex h-2.5 w-2.5 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Review and resolve flagged fraud signals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh((v) => !v)}>
            <Radio size={14} className={autoRefresh ? 'text-green-500' : ''} />
            {autoRefresh ? 'Auto' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Pending Flags" value={data?.stats.pendingCount ?? '—'} icon="🚩" />
        <StatCard title="Critical" value={data?.stats.bySeverity.CRITICAL ?? '—'} icon="🔴" delta={data?.stats.bySeverity.CRITICAL ? 'Immediate action' : undefined} />
        <StatCard title="High Risk" value={data?.stats.bySeverity.HIGH ?? '—'} icon="🟠" />
        <StatCard title="Auto-Suspended" value={loading ? '—' : autoSuspendedCount} icon="🔒" />
      </div>

      {/* Severity filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {SEVERITY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Flags table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldAlert size={16} />
            Fraud Flags ({filteredFlags.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : !filteredFlags.length ? (
            <p className="py-8 text-center text-sm text-gray-400">No flags found for this filter</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-4">User ID</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Severity</th>
                    <th className="pb-3 pr-4">Risk Score</th>
                    <th className="pb-3 pr-4">Created</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredFlags.map((flag) => (
                    <>
                      <tr key={flag.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                          …{flag.userId.slice(-8)}
                        </td>
                        <td className="py-3 pr-4 text-gray-700">
                          {flag.type.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${SEVERITY_BADGE[flag.severity] ?? 'bg-gray-100 text-gray-600'}`}>
                            {flag.severity}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-sm font-bold ${riskScoreColor(flag.riskScore)}`}>
                            {flag.riskScore}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-400">
                          {timeAgo(flag.createdAt)}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {flag.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => {
                                if (resolveId === flag.id) {
                                  setResolveId(null);
                                } else {
                                  setResolveId(flag.id);
                                  setResolveNotes('');
                                }
                              }}
                            >
                              {resolveId === flag.id ? 'Cancel' : 'Resolve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                              disabled={submitting === flag.id}
                              onClick={() => handleAction(flag.id, 'ESCALATED', '')}
                            >
                              {submitting === flag.id ? <RefreshCw size={11} className="animate-spin" /> : 'Escalate'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {resolveId === flag.id && (
                        <tr key={`${flag.id}-form`}>
                          <td colSpan={7} className="bg-gray-50 px-4 pb-4 pt-2">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                              <div className="flex flex-1 flex-col gap-1">
                                <label className="text-xs font-medium text-gray-600">
                                  Resolution Notes (optional)
                                </label>
                                <textarea
                                  value={resolveNotes}
                                  onChange={(e) => setResolveNotes(e.target.value)}
                                  rows={2}
                                  placeholder="Add notes about why this is being cleared..."
                                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAction(flag.id, 'CLEARED', resolveNotes)}
                                disabled={submitting === flag.id}
                                className="shrink-0"
                              >
                                {submitting === flag.id ? (
                                  <RefreshCw size={12} className="animate-spin" />
                                ) : (
                                  'Mark Cleared'
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
