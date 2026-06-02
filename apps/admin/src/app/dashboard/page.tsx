import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import { Users, Wrench, DollarSign, ShieldCheck, AlertOctagon } from 'lucide-react';
import { db } from '@fixit247/database';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Admin Overview' };
export const dynamic = 'force-dynamic';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function fmtAud(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(n);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    activeJobs,
    emergencyJobs,
    pendingVerifications,
    revenueResult,
    verificationQueue,
    openDisputes,
  ] = await Promise.all([
    db.user.count(),
    db.job.count({ where: { status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] } } }),
    db.job.count({ where: { isEmergency: true, status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] } } }),
    db.tradieProfile.count({ where: { verificationStatus: 'PENDING' } }),
    db.payment.aggregate({
      where: { status: 'RELEASED', createdAt: { gte: startOfMonth } },
      _sum: { platformFee: true },
    }),
    db.tradieProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      take: 4,
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        licences: { select: { licenceType: true, status: true }, take: 3 },
        insurances: { select: { status: true }, take: 1 },
      },
    }),
    db.dispute.findMany({
      where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { title: true, id: true } } },
    }),
  ]);

  const revenueMtd = Number(revenueResult._sum.platformFee ?? 0);

  return (
    <AdminShell>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time platform metrics and operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers.toLocaleString()} icon={<Users size={18} />} color="blue" />
        <StatCard title="Active Jobs" value={activeJobs.toString()} delta={`${emergencyJobs} emergency`} icon={<Wrench size={18} />} color="amber" trend="up" />
        <StatCard title="Revenue (MTD)" value={fmtAud(revenueMtd)} icon={<DollarSign size={18} />} color="green" trend="up" />
        <StatCard title="Pending Verifications" value={pendingVerifications.toString()} delta="Needs review" icon={<ShieldCheck size={18} />} color="red" highlight={pendingVerifications > 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Verification queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Verification queue</CardTitle>
            <Badge variant="warning">{pendingVerifications} pending</Badge>
          </CardHeader>
          <CardContent>
            {verificationQueue.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">No pending verifications</p>
            ) : (
              <div className="divide-y">
                {verificationQueue.map((v) => {
                  const docCount = v.licences.length + v.insurances.length;
                  return (
                    <div key={v.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">{v.user.firstName} {v.user.lastName}</p>
                        <p className="text-xs text-gray-500">
                          {v.trades[0] ?? 'Trade'} · {docCount} doc{docCount !== 1 ? 's' : ''} · {timeAgo(v.createdAt)}
                        </p>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/verifications/${v.id}`}>Review</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            <Link href="/verifications" className="mt-2 block text-center text-sm text-brand-600 hover:underline">
              View all →
            </Link>
          </CardContent>
        </Card>

        {/* Active disputes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active disputes</CardTitle>
            <Badge variant="destructive">{openDisputes.length} open</Badge>
          </CardHeader>
          <CardContent>
            {openDisputes.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">No open disputes</p>
            ) : (
              <div className="divide-y">
                {openDisputes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">{d.job?.title ?? `Job dispute`}</p>
                      <p className="text-xs text-gray-500">{timeAgo(d.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">{d.status}</Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/disputes/${d.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/disputes" className="mt-2 block text-center text-sm text-brand-600 hover:underline">
              View all →
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Review Verifications', href: '/verifications', color: 'bg-amber-500 hover:bg-amber-400 text-gray-900' },
          { label: 'Manage Disputes', href: '/disputes', color: 'bg-red-500 hover:bg-red-400 text-white' },
          { label: 'View Analytics', href: '/analytics', color: 'bg-blue-500 hover:bg-blue-400 text-white' },
          { label: 'Live Monitor', href: '/live', color: 'bg-emerald-500 hover:bg-emerald-400 text-white' },
        ].map((a) => (
          <Link key={a.href} href={a.href} className={`flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-colors ${a.color}`}>
            {a.label}
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
