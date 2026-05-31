import Link from 'next/link';
import { db } from '@fixit247/database';
import { getSession } from '@/lib/auth/session';
import { Badge } from '@fixit247/ui';

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'emergency'> = {
  OPEN: 'default',
  ASSIGNED: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  EMERGENCY: 'emergency',
};

export async function RecentJobsList() {
  const session = await getSession();
  const customerProfile = session
    ? await db.customerProfile.findUnique({
        where: { userId: session.id },
        select: { id: true },
      })
    : null;

  const jobs = customerProfile
    ? await db.job.findMany({
        where: { customerId: customerProfile.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          createdAt: true,
          tradie: { select: { user: { select: { firstName: true, lastName: true } } } },
        },
      })
    : [];

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-5 shadow-sm-warm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Jobs</h3>
        <Link href="/jobs" className="text-xs text-brand-600 transition-colors hover:text-brand-700">
          View all →
        </Link>
      </div>
      {jobs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-foreground-muted">No jobs yet.</p>
          <Link href="/jobs/new" className="mt-3 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {jobs.map((job) => {
            const tradieName = job.tradie ? `${job.tradie.user.firstName} ${job.tradie.user.lastName[0]}.` : null;
            const date = new Date(job.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between py-3.5 transition-colors hover:text-brand-700">
                <div>
                  <p className="text-sm font-medium text-foreground">{job.title}</p>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {job.category.replace(/_/g, ' ')} · {tradieName ?? 'Finding tradie…'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-foreground-subtle">{date}</span>
                  <Badge variant={STATUS_VARIANT[job.status] ?? 'default'}>
                    {job.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
