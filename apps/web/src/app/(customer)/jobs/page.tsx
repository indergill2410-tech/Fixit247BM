import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Badge, Button, Card, CardContent } from '@fixit247/ui';

export const metadata: Metadata = { title: 'My Jobs' };
export const dynamic = 'force-dynamic';

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

export default async function CustomerJobsPage() {
  const session = await requireOnboarding();
  const customerProfile = await db.customerProfile.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  const jobs = customerProfile
    ? await db.job.findMany({
        where: { customerId: customerProfile.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          priority: true,
          budgetMin: true,
          budgetMax: true,
          createdAt: true,
          tradie: { select: { user: { select: { firstName: true, lastName: true } } } },
          address: { select: { suburb: true, state: true } },
        },
      })
    : [];

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="My Jobs"
        description="Track every job request, quote, booking, and completed service."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/jobs/emergency">Emergency</Link></Button>
            <Button asChild size="sm"><Link href="/jobs/new">Post a job</Link></Button>
          </div>
        }
      />

      <Card className="mt-6">
        <CardContent className="p-0">
          {jobs.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-foreground-muted">No jobs yet.</p>
              <Button asChild className="mt-4"><Link href="/jobs/new">Post your first job</Link></Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px]">
                <thead>
                  <tr className="border-b bg-background-alt">
                    {['Job', 'Location', 'Tradie', 'Budget', 'Status', 'Created'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-foreground-subtle">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => {
                    const tradieName = job.tradie
                      ? `${job.tradie.user.firstName} ${job.tradie.user.lastName}`.trim()
                      : 'Finding tradie';
                    const budget = job.budgetMin
                      ? `$${Number(job.budgetMin).toLocaleString('en-AU')}${job.budgetMax ? ` - $${Number(job.budgetMax).toLocaleString('en-AU')}` : ''}`
                      : 'Quote required';

                    return (
                      <tr key={job.id} className="hover:bg-background-alt">
                        <td className="px-4 py-4">
                          <Link href={`/jobs/${job.id}`} className="font-medium text-foreground hover:text-brand-600">
                            {job.title}
                          </Link>
                          <p className="mt-1 text-xs text-foreground-subtle">
                            {formatEnumLabel(job.category)} · {formatEnumLabel(job.priority)}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground-muted">
                          {job.address ? `${job.address.suburb}, ${job.address.state}` : 'Address pending'}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground-muted">{tradieName}</td>
                        <td className="px-4 py-4 text-sm text-foreground-muted">{budget}</td>
                        <td className="px-4 py-4">
                          <Badge variant={statusVariant(job.status)}>{formatEnumLabel(job.status)}</Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground-subtle">
                          {job.createdAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
