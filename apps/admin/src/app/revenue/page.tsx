'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, Download, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';

interface RevenueData {
  totalRevenuePlatform: number;
  monthRevenuePlatform: number;
  pendingPayoutsTotal: number;
  subscriptionCounts: { tier: string; _count: { id: number } }[];
  openDisputeCount: number;
}

const TIER_MONTHLY: Record<string, number> = {
  FREE: 0, BASIC: 49, PROFESSIONAL: 99, ELITE: 199,
};

function fmtAud(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(n);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function MiniBarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 pt-4" style={{ height: 100 }}>
      {values.map((v, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-brand-500 transition-all group-hover:bg-brand-400"
            style={{ height: `${Math.max(4, (v / max) * 80)}px` }}
            title={`${labels[i]}: ${fmtAud(v)}`}
          />
          <span className="text-[10px] text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/revenue');
      if (res.ok) setRevenue(await res.json());
    } catch {
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const subscriptionMap = Object.fromEntries(
    (revenue?.subscriptionCounts ?? []).map((s) => [s.tier, s._count.id])
  );

  const subscriptionMRR = ['BASIC', 'PROFESSIONAL', 'ELITE'].reduce(
    (sum, tier) => sum + (subscriptionMap[tier] ?? 0) * (TIER_MONTHLY[tier] ?? 0),
    0
  );

  // Simulated monthly trend (replace with real query in production)
  const now = new Date();
  const last6Months: string[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (5 - i));
    return MONTHS[d.getMonth()] ?? '';
  });
  const mockMonthlyRevenue = [4200, 5800, 7100, 6500, 9200, revenue?.monthRevenuePlatform ?? 0];

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
          <p className="mt-1.5 text-sm text-gray-500">Platform earnings, MRR and subscription revenue</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="All-Time Revenue"
          value={loading ? '—' : fmtAud(revenue?.totalRevenuePlatform ?? 0)}
          delta="Platform fees (released)"
          icon="💰"
        />
        <StatCard
          title="This Month"
          value={loading ? '—' : fmtAud(revenue?.monthRevenuePlatform ?? 0)}
          delta="30-day platform fees"
          icon="📊"
        />
        <StatCard
          title="Subscription MRR"
          value={loading ? '—' : fmtAud(subscriptionMRR)}
          delta="Monthly recurring revenue"
          icon="🔄"
        />
        <StatCard
          title="Pending Payouts"
          value={loading ? '—' : fmtAud(revenue?.pendingPayoutsTotal ?? 0)}
          delta="Awaiting tradie release"
          icon="⏳"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Revenue trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={16} />
              Platform Revenue (6 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            ) : (
              <MiniBarChart values={mockMonthlyRevenue} labels={last6Months} />
            )}
            <p className="mt-2 text-right text-xs text-gray-400">*Current month is live data; prior months are illustrative</p>
          </CardContent>
        </Card>

        {/* Subscription breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />)}
              </div>
            ) : (
              ['BASIC', 'PROFESSIONAL', 'ELITE'].map((tier) => {
                const count = subscriptionMap[tier] ?? 0;
                const revenue = count * (TIER_MONTHLY[tier] ?? 0);
                const pct = subscriptionMRR > 0 ? (revenue / subscriptionMRR) * 100 : 0;
                return (
                  <div key={tier}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{tier} (×{count} @ ${TIER_MONTHLY[tier]}/mo)</span>
                      <span className="font-semibold text-gray-900">{fmtAud(revenue)}/mo</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total MRR</span>
                <span className="text-lg font-bold text-gray-900">{loading ? '—' : fmtAud(subscriptionMRR)}/mo</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-400">
                ARR projection: {loading ? '—' : fmtAud(subscriptionMRR * 12)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
