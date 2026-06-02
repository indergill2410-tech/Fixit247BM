'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, Button } from '@fixit247/ui';
import { Briefcase, Zap, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  status: string;
  category: string;
  isEmergency: boolean;
  suburb: string | null;
  createdAt: string;
  completedAt: string | null;
  customerId: string;
  tradieId: string | null;
  customer: { firstName: string; lastName: string; email: string } | null;
  tradie: { firstName: string | null; lastName: string | null; businessName: string | null } | null;
  payment: { amount: number; status: string } | null;
}

interface JobsData {
  jobs: Job[];
  total: number;
}

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  DISPUTED: 'bg-red-100 text-red-700',
  CLAIMED: 'bg-purple-100 text-purple-700',
  EN_ROUTE: 'bg-teal-100 text-teal-700',
  ARRIVED: 'bg-cyan-100 text-cyan-700',
  DRAFT: 'bg-gray-100 text-gray-500',
};

type StatusFilter = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
const STATUS_TABS: StatusFilter[] = ['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'];

const TRADES = [
  'ALL', 'PLUMBING', 'ELECTRICAL', 'HVAC', 'LOCKSMITH', 'ROOFING',
  'CARPENTRY', 'PAINTING', 'TILING', 'GLAZING', 'PEST_CONTROL',
  'PLASTERING', 'LANDSCAPING', 'CLEANING', 'APPLIANCE_REPAIR', 'GENERAL_MAINTENANCE',
];

const TRADE_LABELS: Record<string, string> = {
  ALL: 'All Trades', PLUMBING: 'Plumbing', ELECTRICAL: 'Electrical', HVAC: 'HVAC',
  LOCKSMITH: 'Locksmith', ROOFING: 'Roofing', CARPENTRY: 'Carpentry', PAINTING: 'Painting',
  TILING: 'Tiling', GLAZING: 'Glazing', PEST_CONTROL: 'Pest Control', PLASTERING: 'Plastering',
  LANDSCAPING: 'Landscaping', CLEANING: 'Cleaning', APPLIANCE_REPAIR: 'Appliance Repair',
  GENERAL_MAINTENANCE: 'General Maintenance',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAUD(amount: number) {
  return `$${Number(amount).toFixed(2)}`;
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: 8 }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 rounded bg-muted/60" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

interface JobStats { total: number; active: number; completed: number; cancelled: number; }

export default function JobsPage() {
  const [data, setData] = useState<JobsData | null>(null);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [dispatching, setDispatching] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (tradeFilter !== 'ALL') params.set('trade', tradeFilter);
      if (emergencyOnly) params.set('isEmergency', 'true');
      const [jobsRes, allRes, activeRes, completedRes, cancelledRes] = await Promise.all([
        fetch(`/api/admin/jobs?${params.toString()}`),
        fetch('/api/admin/jobs?limit=1'),
        fetch('/api/admin/jobs?limit=1&status=OPEN'),
        fetch('/api/admin/jobs?limit=1&status=COMPLETED'),
        fetch('/api/admin/jobs?limit=1&status=CANCELLED'),
      ]);
      if (jobsRes.ok) setData(await jobsRes.json());
      const [allD, activeD, completedD, cancelledD] = await Promise.all([
        allRes.ok ? allRes.json() : { total: 0 },
        activeRes.ok ? activeRes.json() : { total: 0 },
        completedRes.ok ? completedRes.json() : { total: 0 },
        cancelledRes.ok ? cancelledRes.json() : { total: 0 },
      ]);
      setStats({
        total: allD.total ?? 0,
        active: activeD.total ?? 0,
        completed: completedD.total ?? 0,
        cancelled: cancelledD.total ?? 0,
      });
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, tradeFilter, emergencyOnly]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const jobs = data?.jobs ?? [];
  const total = stats?.total ?? data?.total ?? 0;
  const active = stats?.active ?? 0;
  const completed = stats?.completed ?? 0;
  const cancelled = stats?.cancelled ?? 0;

  async function redispatch(jobId: string) {
    setDispatching(jobId);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/dispatch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (res.ok) { toast.success('Re-dispatch triggered'); fetchData(); }
      else { const d = await res.json(); toast.error(d.error ?? 'Failed to re-dispatch'); }
    } catch {
      toast.error('Failed to re-dispatch');
    } finally {
      setDispatching(null);
    }
  }

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Briefcase size={22} className="text-blue-500" />
            Jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all jobs on the platform</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="Total Jobs" value={total} icon={<Briefcase size={18} />} color="blue" />
        <StatCard title="Active" value={active} icon={<Zap size={18} />} color="amber" />
        <StatCard title="Completed" value={completed} icon={<CheckCircle size={18} />} color="green" />
        <StatCard title="Cancelled" value={cancelled} icon={<XCircle size={18} />} color="red" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === s ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={emergencyOnly}
            onChange={(e) => setEmergencyOnly(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <AlertTriangle size={14} className="text-red-500" />
          Emergency only
        </label>
        <select
          value={tradeFilter}
          onChange={(e) => setTradeFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        >
          {TRADES.map((t) => <option key={t} value={t}>{TRADE_LABELS[t] ?? t}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {['Title', 'Trade', 'Status', 'Customer', 'Tradie', 'Created', 'Amount', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <SkeletonRows />
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">No jobs found</td>
                </tr>
              ) : jobs.map((job) => (
                <tr key={job.id} className="transition-colors hover:bg-muted/30">
                  <td className="max-w-[200px] px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      {job.isEmergency && <AlertTriangle size={14} className="shrink-0 text-red-500" />}
                      <span className="truncate font-medium text-foreground">{job.title}</span>
                    </div>
                    {job.suburb && <p className="text-xs text-muted-foreground">{job.suburb}</p>}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{TRADE_LABELS[job.category] ?? job.category}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[job.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {job.customer ? (
                      <>
                        <p className="font-medium text-foreground">{job.customer.firstName} {job.customer.lastName}</p>
                        <p className="text-xs text-muted-foreground">{job.customer.email}</p>
                      </>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {job.tradie ? (
                      <>
                        <p className="font-medium text-foreground">{job.tradie.firstName} {job.tradie.lastName}</p>
                        {job.tradie.businessName && <p className="text-xs text-muted-foreground">{job.tradie.businessName}</p>}
                      </>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(job.createdAt)}</td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {job.payment ? formatAUD(job.payment.amount) : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/jobs/${job.id}`}>View</Link>
                      </Button>
                      {['OPEN', 'MATCHING'].includes(job.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => redispatch(job.id)}
                          disabled={dispatching === job.id}
                        >
                          {dispatching === job.id ? '...' : 'Re-dispatch'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
