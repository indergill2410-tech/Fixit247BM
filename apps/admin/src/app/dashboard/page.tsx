import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
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
    customerCount,
    tradieCount,
    activeJobs,
    emergencyJobs,
    completedJobsMtd,
    pendingVerifications,
    revenueResult,
    heldEscrowResult,
    heldEscrowCount,
    verificationQueue,
    openDisputes,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: 'CUSTOMER' } }),
    db.user.count({ where: { role: 'TRADIE' } }),
    db.job.count({ where: { status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] } } }),
    db.job.count({ where: { isEmergency: true, status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] } } }),
    db.job.count({ where: { status: 'COMPLETED', completedAt: { gte: startOfMonth } } }),
    db.tradieProfile.count({ where: { verificationStatus: 'PENDING' } }),
    db.payment.aggregate({
      where: { status: 'RELEASED', createdAt: { gte: startOfMonth } },
      _sum: { platformFee: true },
    }),
    db.payment.aggregate({
      where: { status: 'HELD_IN_ESCROW' },
      _sum: { amount: true },
    }),
    db.payment.count({ where: { status: 'HELD_IN_ESCROW' } }),
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
  const heldEscrow = Number(heldEscrowResult._sum.amount ?? 0);
  const adminCount = totalUsers - customerCount - tradieCount;

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Command Centre</h1>
        <p className="mt-1.5 text-sm text-gray-500">Real-time trust, revenue, support, and marketplace operations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers.toLocaleString()} icon="👥" />
        <StatCard title="Active Jobs" value={activeJobs.toString()} delta={`${emergencyJobs} emergency`} icon="🔧" />
        <StatCard title="Revenue (MTD)" value={fmtAud(revenueMtd)} icon="💰" trend="up" />
        <StatCard title="Pending Verifications" value={pendingVerifications.toString()} delta="Needs review" icon="🔒" highlight={pendingVerifications > 0} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Customers</span>
              <span className="font-semibold text-gray-900">{customerCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tradies</span>
              <span className="font-semibold text-gray-900">{tradieCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Admins</span>
              <span className="font-semibold text-gray-900">{adminCount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispatch health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Active jobs</span>
              <span className="font-semibold text-gray-900">{activeJobs.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Emergency jobs</span>
              <span className="font-semibold text-red-600">{emergencyJobs.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Completed this month</span>
              <span className="font-semibold text-gray-900">{completedJobsMtd.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Escrow balance</span>
              <span className="font-semibold text-gray-900">{fmtAud(heldEscrow)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Held payments</span>
              <span className="font-semibold text-gray-900">{heldEscrowCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Open disputes</span>
              <span className="font-semibold text-gray-900">{openDisputes.length.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
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
    </AdminShell>
  );
}
