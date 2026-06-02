import Link from 'next/link';
import { db } from '@fixit247/database';
import { getSession } from '@/lib/auth/session';
import { Badge } from '@fixit247/ui';
import { FxIcon, type FxIconName } from '@/components/ui/fx-icon';

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'emergency'> = {
  OPEN: 'default',
  ASSIGNED: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  EMERGENCY: 'emergency',
};

const CATEGORY_ICON: Record<string, FxIconName> = {
  PLUMBING: 'wrench',
  ELECTRICAL: 'zap',
  HVAC: 'wind',
  LOCKSMITH: 'lock',
};

export async function RecentJobsList() {
  const session = await getSession();
  const jobs = session
    ? await db.job.findMany({
        where: { customerId: session.id },
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
    <div className="rounded-2xl border border-border bg-card p-5 dark:bg-white/[0.03] dark:border-white/[0.07]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Jobs</h3>
        <Link href="/jobs" className="text-xs text-brand-600 hover:underline dark:text-brand-400 transition-colors">
          View all →
        </Link>
      </div>
      {jobs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-foreground-muted">No jobs yet.</p>
          <Link href="/jobs/new" className="mt-3 inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {jobs.map((job) => {
            const tradieName = job.tradie ? `${job.tradie.user.firstName} ${job.tradie.user.lastName[0]}.` : null;
            const date = new Date(job.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between py-3.5 hover:opacity-80 transition-opacity">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
                    <FxIcon name={CATEGORY_ICON[job.category] ?? 'wrench'} size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                    <p className="mt-0.5 truncate text-xs text-foreground-subtle">
                      {job.category.replace(/_/g, ' ')} · {tradieName ?? 'Finding tradie…'}
                    </p>
                  </div>
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
