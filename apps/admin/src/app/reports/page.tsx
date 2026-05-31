import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'Reports' };
export const dynamic = 'force-dynamic';

function fmtAud(value: unknown): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function pct(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function AdminReportsPage() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    newUsers,
    newJobs,
    completedJobs,
    emergencyJobs,
    openDisputes,
    pendingVerifications,
    verifiedTradies,
    revenue,
    escrow,
    categoryRows,
  ] = await Promise.all([
    db.user.count({ where: { createdAt: { gte: since } } }),
    db.job.count({ where: { createdAt: { gte: since } } }),
    db.job.count({ where: { status: 'COMPLETED', completedAt: { gte: since } } }),
    db.job.count({ where: { isEmergency: true, createdAt: { gte: since } } }),
    db.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
    db.tradieProfile.count({ where: { verificationStatus: 'PENDING' } }),
    db.tradieProfile.count({ where: { verificationStatus: 'VERIFIED' } }),
    db.payment.aggregate({ where: { status: 'RELEASED', createdAt: { gte: since } }, _sum: { platformFee: true } }),
    db.payment.aggregate({ where: { status: 'HELD_IN_ESCROW' }, _sum: { amount: true } }),
    db.job.groupBy({ by: ['category'], _count: { id: true } }),
  ]);

  const topCategories = [...categoryRows]
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 6);
  const maxCategoryCount = Math.max(...topCategories.map((item) => item._count.id), 1);

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1.5 text-sm text-gray-500">Thirty-day operating snapshot for growth, dispatch, trust, and revenue.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/analytics">Open analytics</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="New Users" value={newUsers.toLocaleString()} delta="Last 30 days" icon="U" />
        <StatCard title="New Jobs" value={newJobs.toLocaleString()} delta={`${pct(completedJobs, newJobs)} completed`} icon="J" />
        <StatCard title="Platform Revenue" value={fmtAud(revenue._sum.platformFee)} delta="Released fees" icon="$" />
        <StatCard title="Held Escrow" value={fmtAud(escrow._sum.amount)} delta="Awaiting release" icon="E" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Category demand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map((row) => (
              <div key={row.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{formatEnumLabel(row.category)}</span>
                  <span className="text-gray-500">{row._count.id.toLocaleString()} jobs</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: pct(row._count.id, maxCategoryCount) }} />
                </div>
              </div>
            ))}
            {topCategories.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No job category data yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ops watchlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Open disputes</span>
              <span className="font-semibold text-gray-900">{openDisputes.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Pending verifications</span>
              <span className="font-semibold text-gray-900">{pendingVerifications.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Verified tradies</span>
              <span className="font-semibold text-gray-900">{verifiedTradies.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Emergency jobs</span>
              <span className="font-semibold text-red-600">{emergencyJobs.toLocaleString()}</span>
            </div>
            <div className="grid gap-2 pt-2">
              <Button variant="outline" size="sm" asChild><Link href="/disputes">Review disputes</Link></Button>
              <Button variant="outline" size="sm" asChild><Link href="/verifications">Review verifications</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
