'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import {
  DollarSign, TrendingUp, Clock, AlertTriangle,
  RefreshCw, Download, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface RevenueData {
  totalRevenuePlatform: number;
  monthRevenuePlatform: number;
  pendingPayoutsTotal: number;
  recentPayments: {
    id: string;
    amount: number;
    platformFee: number;
    status: string;
    createdAt: string;
    jobId: string;
  }[];
  subscriptionCounts: { tier: string; _count: { id: number } }[];
  openDisputeCount: number;
}

interface PricingConfig {
  platform_fee_percent: string;
  credit_cost_simple_standard: string;
  credit_cost_medium_standard: string;
  credit_cost_complex_standard: string;
  emergency_dispatch_fee_aud: string;
  surge_enabled: string;
  referral_bonus_credits: string;
  [key: string]: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  HELD_IN_ESCROW: 'bg-blue-100 text-blue-800',
  RELEASED: 'bg-green-100 text-green-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
  DISPUTED: 'bg-red-100 text-red-800',
  FAILED: 'bg-gray-100 text-gray-800',
};

const TIER_COLORS: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-700',
  BASIC: 'bg-amber-100 text-amber-700',
  PROFESSIONAL: 'bg-slate-100 text-slate-700',
  ELITE: 'bg-yellow-100 text-yellow-700',
};

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtAud(aud: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(aud);
}

export default function AdminPaymentsPage() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [configEditing, setConfigEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<PricingConfig>>({});
  const [saving, setSaving] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, cfgRes] = await Promise.all([
        fetch('/api/admin/revenue'),
        fetch('/api/admin/pricing'),
      ]);
      if (revRes.ok) setRevenue(await revRes.json());
      if (cfgRes.ok) {
        const { config: cfg } = await cfgRes.json();
        setConfig(cfg);
        setEditValues(cfg);
      }
    } catch {
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function saveConfig() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: editValues }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(`Saved ${data.updated} config values`);
      setConfigEditing(false);
      setConfig(editValues as PricingConfig);
    } catch {
      toast.error('Failed to save config');
    } finally {
      setSaving(false);
    }
  }

  const subscriptionMap = Object.fromEntries(
    (revenue?.subscriptionCounts ?? []).map((s) => [s.tier, s._count.id])
  );

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Control Panel</h1>
          <p className="mt-1.5 text-sm text-gray-500">Revenue, payouts, subscriptions and platform config</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Platform Revenue"
          value={loading ? '—' : fmtAud(revenue?.totalRevenuePlatform ?? 0)}
          delta="All-time released fees"
          icon="💰"
        />
        <StatCard
          title="Revenue (30 days)"
          value={loading ? '—' : fmtAud(revenue?.monthRevenuePlatform ?? 0)}
          delta="Platform fees collected"
          icon="📈"
        />
        <StatCard
          title="Pending Payouts"
          value={loading ? '—' : fmtAud(revenue?.pendingPayoutsTotal ?? 0)}
          delta="Awaiting release to tradies"
          icon="⏳"
        />
        <StatCard
          title="Open Disputes"
          value={loading ? '—' : revenue?.openDisputeCount ?? 0}
          delta="Requires review"
          icon="⚠️"
        />
      </div>

      {/* Subscription breakdown */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={16} />
              Subscription Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : (
              ['FREE', 'BASIC', 'PROFESSIONAL', 'ELITE'].map((tier) => (
                <div key={tier} className="flex items-center justify-between rounded-lg border p-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[tier]}`}>
                    {tier}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold">{subscriptionMap[tier] ?? 0} tradies</p>
                    <p className="text-xs text-gray-400">
                      {tier === 'FREE' ? 'Free' : tier === 'BASIC' ? '$49/mo' : tier === 'PROFESSIONAL' ? '$99/mo' : '$199/mo'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={16} />
              Recent Payments (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : !revenue?.recentPayments?.length ? (
              <p className="py-8 text-center text-sm text-gray-400">No payments yet</p>
            ) : (
              <div className="divide-y">
                {revenue.recentPayments.slice(0, 10).map((pmt) => (
                  <div key={pmt.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Job #{pmt.jobId.slice(-8)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(pmt.createdAt).toLocaleDateString('en-AU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{fmtAud(Number(pmt.amount))}</p>
                      <p className="text-xs text-green-600">Fee: {fmtAud(Number(pmt.platformFee))}</p>
                    </div>
                    <span className={`ml-4 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[pmt.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {pmt.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Config Editor */}
      <div className="mt-8">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="mb-4 flex w-full items-center justify-between rounded-xl border bg-white px-6 py-4 text-left shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
              <AlertTriangle size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Platform Configuration</p>
              <p className="text-xs text-gray-500">Fees, credits, surge pricing · Changes take effect immediately</p>
            </div>
          </div>
          {showConfig ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {showConfig && (
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {configEditing ? 'Editing config — changes will apply immediately' : 'Read-only view'}
                </p>
                <div className="flex gap-2">
                  {configEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { setConfigEditing(false); setEditValues(config ?? {}); }}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveConfig} disabled={saving}>
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : null}
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => setConfigEditing(true)}>Edit Config</Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {config && CONFIG_FIELDS.map(({ key, label, suffix }) => (
                  <div key={key} className="rounded-lg border p-4">
                    <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
                    {configEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValues[key] ?? ''}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {config[key]} {suffix}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}

const CONFIG_FIELDS = [
  { key: 'platform_fee_percent', label: 'Platform Fee', suffix: '%' },
  { key: 'credit_cost_simple_standard', label: 'Credit Cost — Simple Standard', suffix: 'credits' },
  { key: 'credit_cost_medium_standard', label: 'Credit Cost — Medium Standard', suffix: 'credits' },
  { key: 'credit_cost_complex_standard', label: 'Credit Cost — Complex Standard', suffix: 'credits' },
  { key: 'emergency_dispatch_fee_aud', label: 'Emergency Dispatch Fee', suffix: 'AUD' },
  { key: 'surge_enabled', label: 'Surge Pricing Enabled', suffix: '' },
  { key: 'referral_bonus_credits', label: 'Referral Bonus Credits', suffix: 'credits' },
];
