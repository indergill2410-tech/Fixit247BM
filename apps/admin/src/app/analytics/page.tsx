'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { toast } from 'sonner';

interface AnalyticsData {
  jobs: {
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    completionRate: number;
    avgResponseTime: number;
  };
  revenue: {
    total: number;
    byDay: { date: string; amount: number }[];
    mrr: number;
    arr: number;
  };
  trades: { category: string; count: number; avgValue: number }[];
  subscriptions: {
    byTier: { FREE: number; BASIC: number; PROFESSIONAL: number; ELITE: number };
  };
}

type Period = '7d' | '30d' | '90d';

function fmt$(n: number): string {
  return '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${p}`);
      if (!res.ok) throw new Error('Failed to load analytics');
      setData(await res.json());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [fetchData, period]);

  const maxRevenue =
    data?.revenue.byDay.reduce((m, d) => Math.max(m, d.amount), 0) ?? 1;

  const statusEntries = data ? Object.entries(data.jobs.byStatus) : [];
  const totalStatus = statusEntries.reduce((s, [, v]) => s + v, 0) || 1;

  const TIER_COLORS: Record<string, string> = {
    FREE: 'bg-gray-200 text-gray-700',
    BASIC: 'bg-blue-100 text-blue-700',
    PROFESSIONAL: 'bg-purple-100 text-purple-700',
    ELITE: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Platform performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => fetchData(period)} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))
        ) : (
          <>
            <StatCard
              title={`Total Jobs (${period})`}
              value={data?.jobs.total ?? '—'}
              icon="🔧"
            />
            <StatCard
              title="Completion Rate"
              value={data ? `${(data.jobs.completionRate * 100).toFixed(1)}%` : '—'}
              icon="✅"
            />
            <StatCard
              title={`Total Revenue (${period})`}
              value={data ? fmt$(data.revenue.total) : '—'}
              icon="💰"
            />
            <StatCard
              title="MRR"
              value={data ? fmt$(data.revenue.mrr) : '—'}
              {...(data ? { delta: `ARR ${fmt$(data.revenue.arr)}` } : {})}
              icon="📈"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={16} />
              Revenue by Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
            ) : !data?.revenue.byDay.length ? (
              <p className="py-8 text-center text-sm text-gray-400">No revenue data</p>
            ) : (
              <div className="flex items-end gap-1 overflow-x-auto pb-2" style={{ height: '200px' }}>
                {data.revenue.byDay.map((day) => {
                  const pct = maxRevenue > 0 ? (day.amount / maxRevenue) * 100 : 0;
                  return (
                    <div
                      key={day.date}
                      className="group relative flex min-w-[28px] flex-1 flex-col items-center justify-end"
                      style={{ height: '100%' }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                        {fmtDate(day.date)}: {fmt$(day.amount)}
                      </div>
                      <div
                        className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                        style={{ height: `${Math.max(pct, 2)}%` }}
                      />
                      <span className="mt-1 text-[10px] text-gray-400">{fmtDate(day.date)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trade Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trade Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-semibold text-gray-500">
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-right">Jobs</th>
                      <th className="pb-2 text-right">Avg Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.trades ?? []).map((row) => (
                      <tr key={row.category} className="border-b last:border-0">
                        <td className="py-2 font-medium text-gray-700">
                          {row.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-2 text-right text-gray-600">{row.count}</td>
                        <td className="py-2 text-right text-gray-600">{fmt$(row.avgValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: subscriptions + job status */}
        <div className="space-y-6">
          {/* Subscription Tier Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(
                    ['FREE', 'BASIC', 'PROFESSIONAL', 'ELITE'] as const
                  ).map((tier) => (
                    <div
                      key={tier}
                      className={`rounded-xl p-4 ${TIER_COLORS[tier]}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                        {tier}
                      </p>
                      <p className="mt-1 text-2xl font-bold">
                        {data?.subscriptions.byTier[tier] ?? 0}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Job Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded-lg bg-gray-100" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {statusEntries.map(([status, count]) => {
                    const pct = ((count / totalStatus) * 100).toFixed(1);
                    return (
                      <div key={status}>
                        <div className="mb-1 flex justify-between text-xs text-gray-600">
                          <span className="font-medium">{status.replace(/_/g, ' ')}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
