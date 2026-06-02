'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { Briefcase, CheckCircle, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TradieProfile {
  businessName: string | null;
  abn: string | null;
  trades: string[];
  verificationStatus: string;
  avgRating: number | null;
  totalJobsCompleted: number;
}

interface Subscription {
  tier: string;
  status: string;
}

interface Job {
  id: string;
  title: string;
  status: string;
  customerId: string;
  tradieId: string | null;
  createdAt: string;
  completedAt: string | null;
  finalPrice: number | null;
  agreedPrice: number | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  job: { title: string };
}

interface UserDetail {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    tradieProfile: TradieProfile | null;
    subscription: Subscription | null;
  };
  recentJobs: Job[];
  recentPayments: Payment[];
  stats: {
    totalJobsAsCustomer: number;
    totalJobsAsTradie: number;
    totalSpent: number;
    totalEarned: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtAUD(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ROLE_BADGE: Record<string, string> = {
  CUSTOMER: 'bg-blue-100 text-blue-700',
  TRADIE: 'bg-amber-100 text-amber-700',
  ADMIN: 'bg-red-100 text-red-700',
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
};

const JOB_STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  DISPUTED: 'bg-red-100 text-red-700',
};

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
  FAILED: 'bg-red-100 text-red-700',
};

const TIER_BADGE: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-600',
  BASIC: 'bg-blue-100 text-blue-700',
  PROFESSIONAL: 'bg-amber-100 text-amber-700',
  ELITE: 'bg-purple-100 text-purple-700',
};

// ── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ActiveTab = 'jobs' | 'payments' | 'profile';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ActiveTab>('jobs');
  const [confirming, setConfirming] = useState<'SUSPEND' | 'UNSUSPEND' | null>(null);
  const [acting, setActing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (res.ok) setData(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAction(action: 'SUSPEND' | 'UNSUSPEND') {
    setActing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const result = await res.json() as { error?: string };
      if (!res.ok) throw new Error(result.error ?? 'Action failed');
      toast.success(action === 'SUSPEND' ? 'Account suspended' : 'Account unsuspended');
      setConfirming(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </AdminShell>
    );
  }

  if (!data) {
    return (
      <AdminShell>
        <p className="text-center text-gray-400">User not found.</p>
      </AdminShell>
    );
  }

  const { user, recentJobs, recentPayments, stats } = data;
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  // Determine customer/tradie profile IDs for job role labelling (passed through jobs data)
  // We identify role from customerId/tradieId comparison
  const customerProfileId = recentJobs.find(j => j.customerId)?.customerId;

  return (
    <AdminShell>
      {/* Back link */}
      <Link href="/users" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft size={14} /> Users
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-white">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-400">{user.phone}</p>}
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                {user.role}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.isActive ? 'Active' : 'Suspended'}
              </span>
              <span className="text-xs text-gray-400">Joined {fmtDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2">
          {user.isActive ? (
            confirming === 'SUSPEND' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Confirm suspend?</span>
                <button
                  onClick={() => handleAction('SUSPEND')}
                  disabled={acting}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {acting ? 'Working…' : 'Yes, Suspend'}
                </button>
                <button onClick={() => setConfirming(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming('SUSPEND')}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Suspend Account
              </button>
            )
          ) : (
            <button
              onClick={() => handleAction('UNSUSPEND')}
              disabled={acting}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {acting ? 'Working…' : 'Unsuspend'}
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Jobs Posted"
          value={stats.totalJobsAsCustomer}
          icon={<Briefcase size={18} />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Jobs Completed"
          value={stats.totalJobsAsTradie}
          icon={<CheckCircle size={18} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Spent"
          value={fmtAUD(stats.totalSpent)}
          icon={<DollarSign size={18} />}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Total Earned"
          value={fmtAUD(stats.totalEarned)}
          icon={<TrendingUp size={18} />}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {(['jobs', 'payments', ...(user.tradieProfile ? ['profile'] : [])] as ActiveTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Jobs tab */}
      {tab === 'jobs' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No jobs found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="pb-3 pr-4">Title</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Role</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium text-gray-800">{job.title}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${JOB_STATUS_BADGE[job.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-500">
                          {job.customerId === customerProfileId ? 'as Customer' : 'as Tradie'}
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-400">{fmtDate(job.createdAt)}</td>
                        <td className="py-3 text-sm text-gray-700">
                          {job.finalPrice != null ? fmtAUD(Number(job.finalPrice)) : job.agreedPrice != null ? fmtAUD(Number(job.agreedPrice)) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payments tab */}
      {tab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No payments found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="pb-3 pr-4">Job</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentPayments.map((pmt) => (
                      <tr key={pmt.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium text-gray-800">{pmt.job.title}</td>
                        <td className="py-3 pr-4 font-semibold text-gray-900">{fmtAUD(Number(pmt.amount))}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PAYMENT_STATUS_BADGE[pmt.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {pmt.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-gray-400">{fmtDate(pmt.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Profile tab (tradies only) */}
      {tab === 'profile' && user.tradieProfile && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tradie Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Business Name</dt>
                  <dd className="mt-1 text-sm text-gray-800">{user.tradieProfile.businessName ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">ABN</dt>
                  <dd className="mt-1 text-sm text-gray-800">{user.tradieProfile.abn ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Verification</dt>
                  <dd className="mt-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      user.tradieProfile.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                      user.tradieProfile.verificationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.tradieProfile.verificationStatus}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Avg Rating</dt>
                  <dd className="mt-1 text-sm text-gray-800">
                    {user.tradieProfile.avgRating != null ? `${Number(user.tradieProfile.avgRating).toFixed(1)} / 5` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Jobs Completed</dt>
                  <dd className="mt-1 text-sm text-gray-800">{user.tradieProfile.totalJobsCompleted}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Trades</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {user.tradieProfile.trades.length > 0
                      ? user.tradieProfile.trades.map((t) => (
                          <span key={t} className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                            {t}
                          </span>
                        ))
                      : <span className="text-sm text-gray-400">—</span>}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {user.subscription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${TIER_BADGE[user.subscription.tier] ?? 'bg-gray-100 text-gray-600'}`}>
                    {user.subscription.tier}
                  </span>
                  <span className="text-sm text-gray-500">{user.subscription.status}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </AdminShell>
  );
}
