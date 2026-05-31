import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Badge, Button, Card, CardContent } from '@fixit247/ui';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'Job Operations' };
export const dynamic = 'force-dynamic';

function fmtAud(value: unknown): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatName(user: { firstName: string; lastName: string; email: string }): string {
  const name = `${user.firstName} ${user.lastName}`.trim();
  return name || user.email;
}

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusVariant(status: string): 'default' | 'secondary' | 'warning' | 'success' | 'destructive' {
  if (status === 'COMPLETED') return 'success';
  if (status === 'CANCELLED') return 'destructive';
  if (status === 'DISPUTED') return 'warning';
  if (status === 'OPEN') return 'default';
  return 'secondary';
}

export default async function AdminJobsPage() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [
    totalJobs,
    openJobs,
    activeJobs,
    emergencyJobs,
    disputedJobs,
    completedThisMonth,
    recentJobs,
  ] = await Promise.all([
    db.job.count(),
    db.job.count({ where: { status: 'OPEN' } }),
    db.job.count({ where: { status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] } } }),
    db.job.count({ where: { isEmergency: true, status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] } } }),
    db.job.count({ where: { status: 'DISPUTED' } }),
    db.job.count({ where: { status: 'COMPLETED', completedAt: { gte: startOfMonth } } }),
    db.job.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        tradie: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        address: { select: { suburb: true, state: true } },
        payment: { select: { amount: true, status: true } },
      },
    }),
  ]);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Operations</h1>
        <p className="mt-1.5 text-sm text-gray-500">Dispatch queue, live job state, and customer-tradie assignment health.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Jobs" value={totalJobs.toLocaleString()} delta={`${completedThisMonth} completed this month`} icon="J" />
        <StatCard title="Open Leads" value={openJobs.toLocaleString()} delta="Waiting for tradies" icon="O" />
        <StatCard title="Active Jobs" value={activeJobs.toLocaleString()} delta={`${emergencyJobs} emergency`} icon="A" />
        <StatCard title="Disputes" value={disputedJobs.toLocaleString()} delta="Needs ops attention" icon="D" />
      </div>

      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Latest jobs</h2>
              <p className="text-sm text-gray-500">Showing the 50 most recent platform jobs.</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard">Overview</Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Job', 'Customer', 'Tradie', 'Location', 'Status', 'Payment', 'Created'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatEnumLabel(job.category)}{job.isEmergency ? ' - Emergency' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatName(job.customer.user)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{job.tradie ? formatName(job.tradie.user) : 'Unassigned'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {job.address ? `${job.address.suburb}, ${job.address.state}` : 'No address'}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusVariant(job.status)}>{formatEnumLabel(job.status)}</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {job.payment ? `${fmtAud(job.payment.amount)} - ${formatEnumLabel(job.payment.status)}` : 'No payment'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {job.createdAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentJobs.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400">No jobs have been created yet.</p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
