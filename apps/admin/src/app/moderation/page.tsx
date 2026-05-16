'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, Shield, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface ModerationAction {
  id: string;
  targetType: string;
  targetId: string;
  actionType: string;
  reason: string;
  createdAt: string;
  adminId: string;
  expiresAt: string | null;
}

interface ModerationData {
  actions: ModerationAction[];
  stats: {
    total: number;
    activeSuspensions: number;
    pendingVerifications: number;
  };
}

type ActionFilter =
  | 'ALL'
  | 'SUSPEND_USER'
  | 'WARN_USER'
  | 'VERIFY_TRADIE'
  | 'REJECT_VERIFICATION'
  | 'CONTENT_REMOVE';

const ACTION_TABS: ActionFilter[] = [
  'ALL',
  'SUSPEND_USER',
  'WARN_USER',
  'VERIFY_TRADIE',
  'REJECT_VERIFICATION',
  'CONTENT_REMOVE',
];

const ACTION_BADGE: Record<string, string> = {
  SUSPEND_USER: 'bg-red-100 text-red-700',
  WARN_USER: 'bg-orange-100 text-orange-700',
  VERIFY_TRADIE: 'bg-green-100 text-green-700',
  REJECT_VERIFICATION: 'bg-red-100 text-red-700',
  CONTENT_REMOVE: 'bg-purple-100 text-purple-700',
};

const TARGET_TYPES = ['USER', 'TRADIE', 'JOB', 'REVIEW'];
const ACTION_TYPES = [
  'SUSPEND_USER',
  'WARN_USER',
  'VERIFY_TRADIE',
  'REJECT_VERIFICATION',
  'CONTENT_REMOVE',
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function ModerationPage() {
  const [data, setData] = useState<ModerationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActionFilter>('ALL');
  const [showNewForm, setShowNewForm] = useState(false);

  // New action form state
  const [targetType, setTargetType] = useState('USER');
  const [targetId, setTargetId] = useState('');
  const [actionType, setActionType] = useState('SUSPEND_USER');
  const [reason, setReason] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/moderation?limit=50');
      if (res.ok) setData(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function submitAction() {
    if (!targetId.trim()) {
      toast.error('Target ID is required');
      return;
    }
    if (!reason.trim()) {
      toast.error('Reason is required');
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        targetType,
        targetId: targetId.trim(),
        actionType,
        reason,
      };
      if (durationDays) body.durationDays = parseInt(durationDays, 10);

      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Action failed');
      toast.success(`Moderation action (${actionType.replace(/_/g, ' ')}) applied successfully`);
      setShowNewForm(false);
      setTargetId('');
      setReason('');
      setDurationDays('');
      setTargetType('USER');
      setActionType('SUSPEND_USER');
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setSubmitting(false);
    }
  }

  const filteredActions = data?.actions.filter(
    (a) => filter === 'ALL' || a.actionType === filter,
  ) ?? [];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moderation Center</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user and content moderation actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowNewForm((v) => !v)}>
            {showNewForm ? <X size={14} /> : <Plus size={14} />}
            {showNewForm ? 'Cancel' : 'New Action'}
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Actions" value={data?.stats.total ?? '—'} icon="🛡️" />
        <StatCard title="Active Suspensions" value={data?.stats.activeSuspensions ?? '—'} icon="🔒" delta={data?.stats.activeSuspensions ? 'Currently enforced' : undefined} />
        <StatCard title="Pending Verifications" value={data?.stats.pendingVerifications ?? '—'} icon="⏳" />
      </div>

      {/* New Action Form Panel */}
      {showNewForm && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-blue-800">
              <Shield size={16} />
              New Moderation Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Target Type</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TARGET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Target ID</label>
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Enter target ID..."
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Action Type</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ACTION_TYPES.map((a) => (
                    <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-600">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="Describe the reason for this action..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Duration (days, optional)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="e.g. 7"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-gray-400">Leave blank for permanent / non-expiring</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={submitAction} disabled={submitting}>
                {submitting ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  'Apply Action'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action type filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {ACTION_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'ALL' ? 'ALL' : tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Actions table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield size={16} />
            Moderation Actions ({filteredActions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : !filteredActions.length ? (
            <p className="py-8 text-center text-sm text-gray-400">No actions found for this filter</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-4">Target</th>
                    <th className="pb-3 pr-4">Action Type</th>
                    <th className="pb-3 pr-4">Reason</th>
                    <th className="pb-3 pr-4">Admin</th>
                    <th className="pb-3 pr-4">Created</th>
                    <th className="pb-3">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredActions.map((action) => (
                    <tr key={action.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                            {action.targetType}
                          </span>
                          <span className="font-mono text-xs text-gray-700">
                            …{action.targetId.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${ACTION_BADGE[action.actionType] ?? 'bg-gray-100 text-gray-600'}`}>
                          {action.actionType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 pr-4 max-w-[200px]">
                        <span className="block truncate text-xs text-gray-600" title={action.reason}>
                          {action.reason}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-gray-500">
                        …{action.adminId.slice(-8)}
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-400">
                        {timeAgo(action.createdAt)}
                      </td>
                      <td className="py-3 text-xs">
                        {action.expiresAt ? (
                          <span className={new Date(action.expiresAt) < new Date() ? 'text-gray-400 line-through' : 'text-gray-600'}>
                            {formatDate(action.expiresAt)}
                          </span>
                        ) : (
                          <span className="text-gray-400">Permanent</span>
                        )}
                      </td>
                    </tr>
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
