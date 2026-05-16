'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, Megaphone, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  revenueGenerated: number;
  costSpent: number;
  scheduledAt: string | null;
  sentAt: string | null;
}

interface CampaignStats {
  _sum: { costSpent: number | null; revenueGenerated: number | null; conversionCount: number | null };
  _count: { id: number };
}

interface CampaignData {
  campaigns: Campaign[];
  stats: CampaignStats;
}

type StatusFilter = 'ALL' | 'ACTIVE' | 'DRAFT' | 'COMPLETED';
type CampaignType = 'EMAIL' | 'PUSH' | 'SMS' | 'REFERRAL' | 'SEO' | 'PAID_SOCIAL' | 'RETARGETING';

const TYPE_BADGE: Record<string, string> = {
  EMAIL: 'bg-blue-100 text-blue-700',
  PUSH: 'bg-purple-100 text-purple-700',
  SMS: 'bg-green-100 text-green-700',
  REFERRAL: 'bg-orange-100 text-orange-700',
  SEO: 'bg-teal-100 text-teal-700',
  PAID_SOCIAL: 'bg-pink-100 text-pink-700',
  RETARGETING: 'bg-red-100 text-red-700',
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-blue-100 text-blue-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
};

function pct(num: number, denom: number): string {
  if (!denom) return '—';
  return `${((num / denom) * 100).toFixed(1)}%`;
}

function roi(revenue: number, cost: number): string {
  if (!cost) return '—';
  return `${(((revenue - cost) / cost) * 100).toFixed(1)}%`;
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CampaignsPage() {
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'EMAIL' as CampaignType,
    scheduledAt: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/campaigns');
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          scheduledAt: form.scheduledAt || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Campaign created');
      setForm({ name: '', type: 'EMAIL', scheduledAt: '' });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error('Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  }

  const filtered =
    data?.campaigns.filter((c) => statusFilter === 'ALL' || c.status === statusFilter) ?? [];

  const totalRevenue = data?.stats._sum.revenueGenerated ?? 0;
  const totalCost = data?.stats._sum.costSpent ?? 0;
  const totalConversions = data?.stats._sum.conversionCount ?? 0;
  const totalCampaigns = data?.stats._count.id ?? 0;

  const overallROI =
    totalCost > 0
      ? `${(((totalRevenue - totalCost) / totalCost) * 100).toFixed(1)}%`
      : '—';

  const statusTabs: StatusFilter[] = ['ALL', 'ACTIVE', 'DRAFT', 'COMPLETED'];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone size={22} className="text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Create and track multi-channel marketing campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Cancel' : 'New Campaign'}
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Campaigns" value={totalCampaigns} icon="📣" />
        <StatCard title="Total Conversions" value={totalConversions} icon="🎯" />
        <StatCard title="Total Revenue Generated" value={formatCurrency(totalRevenue)} icon="💰" />
        <StatCard title="Total Spend" value={formatCurrency(totalCost)} icon="💸" delta={`ROI: ${overallROI}`} />
      </div>

      {/* New Campaign inline form */}
      {showForm && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-sm text-orange-800">New Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Campaign Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded border border-gray-200 px-3 py-1.5 text-sm w-52"
                  placeholder="e.g. Summer Promo"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CampaignType }))}
                  className="rounded border border-gray-200 px-3 py-1.5 text-sm"
                >
                  {(['EMAIL', 'PUSH', 'SMS', 'REFERRAL', 'SEO', 'PAID_SOCIAL', 'RETARGETING'] as CampaignType[]).map(
                    (t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Scheduled At (optional)</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  className="rounded border border-gray-200 px-3 py-1.5 text-sm"
                />
              </div>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? <RefreshCw size={12} className="animate-spin" /> : 'Create'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Status filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Campaigns ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : !filtered.length ? (
            <p className="py-8 text-center text-sm text-gray-400">No campaigns found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-semibold text-gray-500">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Recipients</th>
                    <th className="px-4 py-3">Open Rate</th>
                    <th className="px-4 py-3">Click Rate</th>
                    <th className="px-4 py-3">Conversions</th>
                    <th className="px-4 py-3">Revenue</th>
                    <th className="px-4 py-3">Cost</th>
                    <th className="px-4 py-3">ROI</th>
                    <th className="px-4 py-3">Scheduled</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_BADGE[c.type] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {c.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[c.status] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.recipientCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{pct(c.openCount, c.recipientCount)}</td>
                      <td className="px-4 py-3 text-gray-600">{pct(c.clickCount, c.recipientCount)}</td>
                      <td className="px-4 py-3 text-gray-600">{c.conversionCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(c.revenueGenerated)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(c.costSpent)}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">
                        {roi(c.revenueGenerated, c.costSpent)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {c.scheduledAt ? new Date(c.scheduledAt).toLocaleDateString('en-AU') : '—'}
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
