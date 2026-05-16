'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import { RefreshCw, Radio, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Tradie {
  tradieId: string;
  score: number;
  tier: string;
  badge: string;
  completionRate: number;
  avgRating: number;
  lastUpdated: string;
}

interface TrustData {
  tradies: Tradie[];
  stats: {
    avgScore: number;
    tierCounts: { BRONZE: number; SILVER: number; GOLD: number; PLATINUM: number };
  };
}

const TIER_COLORS: Record<string, string> = {
  PLATINUM: 'bg-purple-100 text-purple-700',
  GOLD: 'bg-yellow-100 text-yellow-700',
  SILVER: 'bg-gray-100 text-gray-700',
  BRONZE: 'bg-amber-100 text-amber-700',
};

const TIER_PILL_COLORS: Record<string, string> = {
  BRONZE: 'bg-amber-100 text-amber-700 border border-amber-200',
  SILVER: 'bg-gray-100 text-gray-700 border border-gray-200',
  GOLD: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  PLATINUM: 'bg-purple-100 text-purple-700 border border-purple-200',
};

function scoreBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-700';
  if (score >= 60) return 'text-yellow-700';
  if (score >= 40) return 'text-orange-700';
  return 'text-red-700';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function TrustPage() {
  const [data, setData] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [overrideId, setOverrideId] = useState<string | null>(null);
  const [overrideScore, setOverrideScore] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/trust?limit=50');
      if (res.ok) setData(await res.json());
    } catch {
      /* silent — auto-refreshing */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  async function submitOverride(tradieId: string) {
    const score = Number(overrideScore);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }
    if (!overrideReason.trim()) {
      toast.error('Please provide a reason for the override');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/trust/${tradieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, reason: overrideReason }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Override failed');
      toast.success(`Trust score updated to ${score} for ${tradieId.slice(-8)}`);
      setOverrideId(null);
      setOverrideScore('');
      setOverrideReason('');
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Override failed');
    } finally {
      setSubmitting(false);
    }
  }

  const lowScoreCount = data?.tradies.filter((t) => t.score < 40).length ?? 0;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Trust Engine</h1>
            <span className={`flex h-2.5 w-2.5 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Tradie trust scores and tier management</p>
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
        <StatCard title="Avg Trust Score" value={data ? data.stats.avgScore.toFixed(1) : '—'} icon="🏅" />
        <StatCard title="Platinum Tradies" value={data?.stats.tierCounts.PLATINUM ?? '—'} icon="💎" />
        <StatCard title="Gold Tradies" value={data?.stats.tierCounts.GOLD ?? '—'} icon="🥇" />
        <StatCard title="Low Score (<40)" value={loading ? '—' : lowScoreCount} icon="⚠️" delta={lowScoreCount > 0 ? 'Needs attention' : 'All clear'} />
      </div>

      {/* Tier distribution */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldCheck size={16} />
            Tier Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const).map((tier) => (
              <span key={tier} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${TIER_PILL_COLORS[tier]}`}>
                {tier} — {data?.stats.tierCounts[tier] ?? 0}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tradies table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tradie Trust Scores ({data?.tradies.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : !data?.tradies.length ? (
            <p className="py-8 text-center text-sm text-gray-400">No tradies found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-4">Tradie ID</th>
                    <th className="pb-3 pr-4">Score</th>
                    <th className="pb-3 pr-4">Tier</th>
                    <th className="pb-3 pr-4">Completion</th>
                    <th className="pb-3 pr-4">Rating</th>
                    <th className="pb-3 pr-4">Updated</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.tradies.map((tradie) => (
                    <>
                      <tr key={tradie.tradieId} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                          …{tradie.tradieId.slice(-8)}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full ${scoreBarColor(tradie.score)}`}
                                style={{ width: `${tradie.score}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${scoreTextColor(tradie.score)}`}>
                              {tradie.score}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIER_COLORS[tradie.tier] ?? 'bg-gray-100 text-gray-600'}`}>
                            {tradie.tier}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-700">
                          {(tradie.completionRate * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 pr-4 text-gray-700">
                          ⭐ {tradie.avgRating.toFixed(1)}
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-400">
                          {timeAgo(tradie.lastUpdated)}
                        </td>
                        <td className="py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              if (overrideId === tradie.tradieId) {
                                setOverrideId(null);
                              } else {
                                setOverrideId(tradie.tradieId);
                                setOverrideScore(String(tradie.score));
                                setOverrideReason('');
                              }
                            }}
                          >
                            {overrideId === tradie.tradieId ? 'Cancel' : 'Override'}
                          </Button>
                        </td>
                      </tr>
                      {overrideId === tradie.tradieId && (
                        <tr key={`${tradie.tradieId}-form`}>
                          <td colSpan={7} className="bg-gray-50 px-4 pb-4 pt-2">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-600">New Score (0–100)</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={overrideScore}
                                  onChange={(e) => setOverrideScore(e.target.value)}
                                  className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex flex-1 flex-col gap-1">
                                <label className="text-xs font-medium text-gray-600">Reason</label>
                                <textarea
                                  value={overrideReason}
                                  onChange={(e) => setOverrideReason(e.target.value)}
                                  rows={2}
                                  placeholder="Reason for override..."
                                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <Button
                                size="sm"
                                onClick={() => submitOverride(tradie.tradieId)}
                                disabled={submitting}
                                className="shrink-0"
                              >
                                {submitting ? <RefreshCw size={12} className="animate-spin" /> : 'Apply'}
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
