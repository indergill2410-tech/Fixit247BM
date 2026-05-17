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
  const jobs = session
    ? await db.job.findMany({
        where: { customerId: session.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          tradeCategory: true,
          status: true,
          createdAt: true,
          tradie: { select: { firstName: true, lastName: true } },
        },
      })
    : [];

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Recent Jobs</h3>
        <Link href="/jobs" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
          View all →
        </Link>
      </div>
      {jobs.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">No jobs yet.</p>
          <Link href="/jobs/new" className="mt-3 inline-block rounded-xl bg-brand-400 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-brand-300 transition-colors">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/6">
          {jobs.map((job) => {
            const tradieName = job.tradie ? `${job.tradie.firstName} ${job.tradie.lastName[0]}.` : null;
            const date = new Date(job.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between py-3.5 hover:opacity-80 transition-opacity">
                <div>
                  <p className="text-sm font-medium text-white">{job.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {job.tradeCategory} · {tradieName ?? 'Finding tradie…'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-600">{date}</span>
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
