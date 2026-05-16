'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface SuburbSummary {
  suburb: string;
  state: string;
  demandScore: number;
  expansionPriority: number;
  isUnderserved: boolean;
}

interface FunnelMetrics {
  signups: number;
  jobs: number;
  referrals: number;
  totalEvents: number;
}

interface GrowthData {
  topSuburbs: SuburbSummary[];
  underservedSuburbs: SuburbSummary[];
  funnelMetrics: FunnelMetrics;
}

type Period = '7' | '30' | '90';

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 text-right text-xs text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-5 overflow-hidden rounded bg-gray-100">
        <div
          className={`h-full rounded ${color} flex items-center justify-end pr-2 transition-all`}
          style={{ width: `${pct}%` }}
        >
          {pct > 12 && (
            <span className="text-[10px] font-semibold text-white">{value.toLocaleString()}</span>
          )}
        </div>
      </div>
      {pct <= 12 && (
        <span className="text-xs font-semibold text-gray-700 w-14 shrink-0">{value.toLocaleString()}</span>
      )}
      <span className="text-[10px] text-gray-400 w-12 shrink-0">{pct.toFixed(1)}%</span>
    </div>
  );
}

export default function GrowthPage() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30');

  const fetchData = useCallback(async (days: Period = period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/growth/analytics?days=${days}`);
      if (res.ok) setData(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const fm = data?.funnelMetrics;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={22} className="text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Growth Analytics</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Platform growth funnel, signups, and suburb expansion insights</p>
        </div>
        <div className="flex gap-2">
          {/* Period selector */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {(['7', '30', '90'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchData(period)} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title={`Signups (${period}d)`} value={fm?.signups ?? '—'} icon="🧑‍💼" />
        <StatCard title="Jobs Started" value={fm?.jobs ?? '—'} icon="🔧" />
        <StatCard title="Referral Conversions" value={fm?.referrals ?? '—'} icon="🎁" />
        <StatCard title="Total Growth Events" value={fm?.totalEvents ?? '—'} icon="📊" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Funnel visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Conversion Funnel ({period}d)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            ) : !fm ? (
              <p className="text-sm text-gray-400">No data available</p>
            ) : (
              <div className="space-y-3">
                <FunnelBar
                  label="Total Events"
                  value={fm.totalEvents}
                  max={fm.totalEvents}
                  color="bg-gray-400"
                />
                <FunnelBar
                  label="Signups"
                  value={fm.signups}
                  max={fm.totalEvents}
                  color="bg-emerald-500"
                />
                <FunnelBar
                  label="Jobs Started"
                  value={fm.jobs}
                  max={fm.totalEvents}
                  color="bg-blue-500"
                />
                <FunnelBar
                  label="Referrals Converted"
                  value={fm.referrals}
                  max={fm.totalEvents}
                  color="bg-orange-500"
                />
              </div>
            )}
            {fm && (
              <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3 text-center">
                <div>
                  <p className="text-xs text-gray-500">Events → Signups</p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {fm.totalEvents > 0 ? ((fm.signups / fm.totalEvents) * 100).toFixed(2) : '—'}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Signups → Jobs</p>
                  <p className="text-sm font-semibold text-blue-700">
                    {fm.signups > 0 ? ((fm.jobs / fm.signups) * 100).toFixed(2) : '—'}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jobs → Referrals</p>
                  <p className="text-sm font-semibold text-orange-700">
                    {fm.jobs > 0 ? ((fm.referrals / fm.jobs) * 100).toFixed(2) : '—'}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Top Suburbs by Demand */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Suburbs by Demand</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
              ) : !data?.topSuburbs.length ? (
                <p className="text-sm text-gray-400">No data</p>
              ) : (
                <div className="space-y-2">
                  {data.topSuburbs.map((s, idx) => (
                    <div key={`${s.suburb}_${s.state}`} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{s.suburb}</p>
                          <p className="text-[10px] text-gray-400">{s.state}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.min(100, s.demandScore)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700">{s.demandScore.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Underserved Suburbs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Underserved Suburbs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
              ) : !data?.underservedSuburbs.length ? (
                <p className="text-sm text-gray-400">None flagged</p>
              ) : (
                <div className="space-y-2">
                  {data.underservedSuburbs.map((s) => (
                    <div key={`${s.suburb}_${s.state}`} className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{s.suburb}</p>
                        <p className="text-[10px] text-gray-400">{s.state}</p>
                      </div>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                        P{s.expansionPriority}
                      </span>
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
