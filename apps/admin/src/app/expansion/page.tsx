'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import { RefreshCw, Radio, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface SuburbMetric {
  suburb: string;
  state: string;
  demandScore: number;
  supplyScore: number;
  conversionRate: number;
  isUnderserved: boolean;
  expansionPriority: number;
  jobCount30d: number;
  tradieCount: number;
}

interface Stats {
  _count: { id: number };
  _avg: { demandScore: number | null; supplyScore: number | null; conversionRate: number | null };
}

interface ExpansionData {
  suburbs: SuburbMetric[];
  stats: Stats;
}

type Filter = 'all' | 'underserved' | 'high-demand';

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-gray-600">{value.toFixed(0)}</span>
    </div>
  );
}

export default function ExpansionPage() {
  const [data, setData] = useState<ExpansionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [priorityEdits, setPriorityEdits] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = useCallback(async (f: Filter = filter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/expansion?filter=${f}&limit=50`);
      if (res.ok) setData(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchData(filter), 60_000);
    return () => clearInterval(interval);
  }, [autoRefresh, filter, fetchData]);

  async function setPriority(suburb: SuburbMetric) {
    const key = `${suburb.suburb}_${suburb.state}`;
    const newPriority = priorityEdits[key] ?? suburb.expansionPriority;
    setSaving(key);
    try {
      const res = await fetch('/api/admin/expansion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suburb: suburb.suburb, state: suburb.state, expansionPriority: newPriority }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Priority updated for ${suburb.suburb}`);
      fetchData(filter);
    } catch {
      toast.error('Failed to update priority');
    } finally {
      setSaving(null);
    }
  }

  const filterTabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'underserved', label: 'UNDERSERVED' },
    { key: 'high-demand', label: 'HIGH DEMAND' },
  ];

  const underservedCount = data?.suburbs.filter((s) => s.isUnderserved).length ?? 0;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Globe size={22} className="text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Market Expansion</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Local suburb demand, supply, and expansion priority management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh((v) => !v)}>
            <Radio size={14} className={autoRefresh ? 'text-green-500' : ''} />
            {autoRefresh ? 'Auto (60s)' : 'Manual'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchData(filter)} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Suburbs Tracked" value={data?.stats._count.id ?? '—'} icon="🗺️" />
        <StatCard title="Underserved Suburbs" value={underservedCount} icon="⚠️" />
        <StatCard
          title="Avg Demand Score"
          value={data?.stats._avg.demandScore != null ? data.stats._avg.demandScore.toFixed(1) : '—'}
          icon="📈"
        />
        <StatCard
          title="Avg Supply Score"
          value={data?.stats._avg.supplyScore != null ? data.stats._avg.supplyScore.toFixed(1) : '—'}
          icon="🔧"
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Suburb table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Suburb Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : !data?.suburbs.length ? (
            <p className="py-8 text-center text-sm text-gray-400">No suburbs found for this filter</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-semibold text-gray-500">
                    <th className="px-4 py-3">Suburb</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Demand</th>
                    <th className="px-4 py-3">Supply</th>
                    <th className="px-4 py-3">Conv. Rate</th>
                    <th className="px-4 py-3">Jobs (30d)</th>
                    <th className="px-4 py-3">Tradies</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.suburbs.map((s) => {
                    const key = `${s.suburb}_${s.state}`;
                    const currentPriority = priorityEdits[key] ?? s.expansionPriority;
                    return (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{s.suburb}</span>
                            {s.isUnderserved && (
                              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                                Underserved
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{s.state}</td>
                        <td className="px-4 py-3">
                          <ScoreBar value={s.demandScore} />
                        </td>
                        <td className="px-4 py-3">
                          <ScoreBar value={s.supplyScore} />
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {(s.conversionRate * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.jobCount30d}</td>
                        <td className="px-4 py-3 text-gray-600">{s.tradieCount}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                            {s.expansionPriority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={currentPriority}
                              onChange={(e) =>
                                setPriorityEdits((prev) => ({
                                  ...prev,
                                  [key]: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)),
                                }))
                              }
                              className="w-14 rounded border border-gray-200 px-2 py-1 text-xs text-center"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPriority(s)}
                              disabled={saving === key}
                              className="text-xs"
                            >
                              {saving === key ? <RefreshCw size={11} className="animate-spin" /> : 'Set'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
