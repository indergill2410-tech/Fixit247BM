'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { FileText, DollarSign, Users, Download, Loader2 } from 'lucide-react';

function downloadCSV(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(','), ...rows.map((r) => r.map(escape).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthStart(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default function ReportsPage() {
  // Jobs export state
  const [jobsFrom, setJobsFrom] = useState(monthStart());
  const [jobsTo, setJobsTo] = useState(today());
  const [jobsLoading, setJobsLoading] = useState(false);

  // Revenue export state
  const [revFrom, setRevFrom] = useState(monthStart());
  const [revTo, setRevTo] = useState(today());
  const [revLoading, setRevLoading] = useState(false);

  // Users export state
  const [usersFrom, setUsersFrom] = useState(monthStart());
  const [usersTo, setUsersTo] = useState(today());
  const [usersLoading, setUsersLoading] = useState(false);

  async function handleJobsExport() {
    setJobsLoading(true);
    try {
      const res = await fetch('/api/admin/jobs?limit=1000');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      const jobs: {
        id: string; title: string; category: string; status: string;
        suburb: string; customerEmail?: string; tradieEmail?: string;
        amount?: number; createdAt: string; completedAt?: string;
      }[] = data.jobs ?? data ?? [];

      const from = new Date(jobsFrom);
      const to = new Date(jobsTo + 'T23:59:59');
      const filtered = jobs.filter((j) => {
        const d = new Date(j.createdAt);
        return d >= from && d <= to;
      });

      downloadCSV(
        `jobs-export-${jobsFrom}-to-${jobsTo}.csv`,
        ['id', 'title', 'category', 'status', 'suburb', 'customer_email', 'tradie_email', 'amount', 'created_at', 'completed_at'],
        filtered.map((j) => [j.id, j.title, j.category, j.status, j.suburb, j.customerEmail ?? '', j.tradieEmail ?? '', j.amount ?? '', j.createdAt, j.completedAt ?? '']),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setJobsLoading(false);
    }
  }

  async function handleRevenueExport() {
    setRevLoading(true);
    try {
      const res = await fetch('/api/admin/revenue');
      if (!res.ok) throw new Error('Failed to fetch revenue');
      const data = await res.json();
      const rows: {
        date: string; grossRevenue?: number; platformFees?: number;
        netToTradies?: number; jobCount?: number;
      }[] = data.daily ?? data.rows ?? data ?? [];

      const from = new Date(revFrom);
      const to = new Date(revTo + 'T23:59:59');
      const filtered = rows.filter((r) => {
        const d = new Date(r.date);
        return d >= from && d <= to;
      });

      downloadCSV(
        `revenue-export-${revFrom}-to-${revTo}.csv`,
        ['date', 'gross_revenue', 'platform_fees', 'net_to_tradies', 'job_count'],
        filtered.map((r) => [r.date, r.grossRevenue ?? '', r.platformFees ?? '', r.netToTradies ?? '', r.jobCount ?? '']),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setRevLoading(false);
    }
  }

  async function handleUsersExport() {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users?limit=5000');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      const users: {
        id: string; email: string; firstName?: string; lastName?: string;
        role?: string; isActive?: boolean; createdAt: string;
      }[] = data.users ?? data ?? [];

      const from = new Date(usersFrom);
      const to = new Date(usersTo + 'T23:59:59');
      const filtered = users.filter((u) => {
        const d = new Date(u.createdAt);
        return d >= from && d <= to;
      });

      downloadCSV(
        `users-export-${usersFrom}-to-${usersTo}.csv`,
        ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at'],
        filtered.map((u) => [u.id, u.email, u.firstName ?? '', u.lastName ?? '', u.role ?? '', String(u.isActive ?? ''), u.createdAt]),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setUsersLoading(false);
    }
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Export platform data as CSV for analysis</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Jobs Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <FileText size={20} className="text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Jobs Export</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">All job records with customer & tradie info</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <input
                type="date"
                value={jobsFrom}
                onChange={(e) => setJobsFrom(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <input
                type="date"
                value={jobsTo}
                onChange={(e) => setJobsTo(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold"
              onClick={handleJobsExport}
              disabled={jobsLoading}
            >
              {jobsLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Download size={16} className="mr-2" />
              )}
              Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Revenue Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <DollarSign size={20} className="text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Revenue Export</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Daily revenue breakdown with platform fees</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <input
                type="date"
                value={revFrom}
                onChange={(e) => setRevFrom(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <input
                type="date"
                value={revTo}
                onChange={(e) => setRevTo(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold"
              onClick={handleRevenueExport}
              disabled={revLoading}
            >
              {revLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Download size={16} className="mr-2" />
              )}
              Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Users Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Users size={20} className="text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Users Export</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">All user accounts with roles and status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">From</label>
              <input
                type="date"
                value={usersFrom}
                onChange={(e) => setUsersFrom(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">To</label>
              <input
                type="date"
                value={usersTo}
                onChange={(e) => setUsersTo(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold"
              onClick={handleUsersExport}
              disabled={usersLoading}
            >
              {usersLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Download size={16} className="mr-2" />
              )}
              Download CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
