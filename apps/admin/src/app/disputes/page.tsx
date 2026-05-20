'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, Scale } from 'lucide-react';
import { toast } from 'sonner';

interface Dispute {
  id: string;
  jobId: string;
  raisedBy: string;
  reason: string;
  status: string;
  amount: number;
  createdAt: string;
  respondBy: string;
  details?: string;
  evidence?: string[];
}

interface DisputeData {
  disputes: Dispute[];
  stats: {
    open: number;
    inReview: number;
    resolved: number;
    avgResolutionDays: number;
  };
}

type StatusFilter = 'ALL' | 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

const STATUS_TABS: StatusFilter[] = ['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED'];

const RESOLUTION_OPTIONS = [
  { value: 'CUSTOMER_WIN', label: 'Customer Win' },
  { value: 'TRADIE_WIN', label: 'Tradie Win' },
  { value: 'SPLIT', label: 'Split Decision' },
  { value: 'DISMISSED', label: 'Dismissed' },
];

function formatAUD(amount: number): string {
  return `$${amount.toFixed(2)} AUD`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isPastDue(iso: string): boolean {
  return new Date(iso) < new Date();
}

export default function DisputesPage() {
  const [data, setData] = useState<DisputeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState('CUSTOMER_WIN');
  const [refundAmount, setRefundAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/disputes?limit=50');
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

  async function submitResolution(disputeId: string) {
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        status: 'RESOLVED',
        resolution,
        notes,
      };
      if (refundAmount) body.refundAmount = parseFloat(refundAmount);

      const res = await fetch(`/api/admin/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Resolution failed');
      toast.success('Dispute resolved successfully');
      setExpandedId(null);
      setResolution('CUSTOMER_WIN');
      setRefundAmount('');
      setNotes('');
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Resolution failed');
    } finally {
      setSubmitting(false);
    }
  }

  const filteredDisputes = data?.disputes.filter(
    (d) => filter === 'ALL' || d.status === filter,
  ) ?? [];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and resolve customer and tradie disputes</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Open Disputes" value={data?.stats.open ?? '—'} icon="⚖️" {...(data?.stats.open ? { delta: 'Needs attention' } : {})} />
        <StatCard title="In Review" value={data?.stats.inReview ?? '—'} icon="🔍" />
        <StatCard title="Resolved" value={data?.stats.resolved ?? '—'} icon="✅" />
        <StatCard title="Avg Resolution (days)" value={data ? data.stats.avgResolutionDays.toFixed(1) : '—'} icon="📅" />
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Disputes table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Scale size={16} />
            Disputes ({filteredDisputes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : !filteredDisputes.length ? (
            <p className="py-8 text-center text-sm text-gray-400">No disputes found for this filter</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Job</th>
                    <th className="pb-3 pr-4">Raised By</th>
                    <th className="pb-3 pr-4">Reason</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Created</th>
                    <th className="pb-3 pr-4">Respond By</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDisputes.map((dispute) => (
                    <>
                      <tr key={dispute.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                          {dispute.id.slice(0, 8)}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs text-gray-500">
                          {dispute.jobId.slice(0, 8)}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                          …{dispute.raisedBy.slice(-8)}
                        </td>
                        <td className="py-3 pr-4 max-w-[160px]">
                          <span className="block truncate text-gray-700" title={dispute.reason}>
                            {dispute.reason}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium text-gray-700">
                          {formatAUD(dispute.amount)}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[dispute.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {dispute.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-400">
                          {formatDate(dispute.createdAt)}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-medium ${isPastDue(dispute.respondBy) ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                            {isPastDue(dispute.respondBy) ? '⚠️ ' : ''}{formatDate(dispute.respondBy)}
                          </span>
                        </td>
                        <td className="py-3">
                          {dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => {
                                if (expandedId === dispute.id) {
                                  setExpandedId(null);
                                } else {
                                  setExpandedId(dispute.id);
                                  setResolution('CUSTOMER_WIN');
                                  setRefundAmount('');
                                  setNotes('');
                                }
                              }}
                            >
                              {expandedId === dispute.id ? 'Close' : 'Review'}
                            </Button>
                          )}
                        </td>
                      </tr>
                      {expandedId === dispute.id && (
                        <tr key={`${dispute.id}-panel`}>
                          <td colSpan={9} className="bg-gray-50 px-6 pb-6 pt-3">
                            <div className="grid gap-6 lg:grid-cols-2">
                              {/* Dispute details */}
                              <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-800">Dispute Details</h3>
                                <div className="rounded-lg border border-gray-200 bg-white p-4">
                                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Reason</p>
                                  <p className="text-sm text-gray-800">{dispute.reason}</p>
                                  {dispute.details && (
                                    <>
                                      <p className="text-xs font-medium text-gray-500 uppercase mt-3 mb-1">Details</p>
                                      <p className="text-sm text-gray-700">{dispute.details}</p>
                                    </>
                                  )}
                                </div>
                                {dispute.evidence && dispute.evidence.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Evidence</p>
                                    <ul className="space-y-1">
                                      {dispute.evidence.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-blue-600">
                                          <span>📎</span>
                                          <span className="truncate">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Resolution form */}
                              <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-800">Resolution</h3>
                                <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Outcome</label>
                                    <select
                                      value={resolution}
                                      onChange={(e) => setResolution(e.target.value)}
                                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      {RESOLUTION_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">
                                      Refund Amount (AUD, optional)
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      step={0.01}
                                      value={refundAmount}
                                      onChange={(e) => setRefundAmount(e.target.value)}
                                      placeholder="0.00"
                                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-600">Notes</label>
                                    <textarea
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      rows={3}
                                      placeholder="Resolution reasoning and notes..."
                                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => submitResolution(dispute.id)}
                                    disabled={submitting}
                                    className="w-full"
                                  >
                                    {submitting ? (
                                      <RefreshCw size={13} className="animate-spin" />
                                    ) : (
                                      'Submit Resolution'
                                    )}
                                  </Button>
                                </div>
                              </div>
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
