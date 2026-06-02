import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Star } from 'lucide-react';

export const metadata: Metadata = { title: 'My Reviews | Fixit247' };
export const dynamic = 'force-dynamic';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'fill-brand-400 text-brand-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const session = await requireRole('CUSTOMER');

  const reviews = await db.review.findMany({
    where: { reviewerId: session.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      rating: true,
      title: true,
      body: true,
      createdAt: true,
      responseText: true,
      respondedAt: true,
      job: { select: { id: true, title: true } },
      reviewee: { select: { firstName: true, lastName: true } },
    },
  });

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="My Reviews"
        description="Reviews you've left for tradies"
        badge={reviews.length > 0 ? { label: `${reviews.length} review${reviews.length === 1 ? '' : 's'}`, variant: 'default' } : undefined}
      />

      {reviews.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
            <Star size={32} />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">No reviews yet</h2>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            Reviews you&apos;ve left for tradies will appear here. Complete a job to leave your first review.
          </p>
          <Link href="/dashboard" className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-400">
            Go to dashboard →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => {
            const tradieName = `${review.reviewee.firstName} ${review.reviewee.lastName}`.trim();
            return (
              <div key={review.id} className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{tradieName}</p>
                    <Link href={`/jobs/${review.job.id}`} className="text-xs text-gray-500 hover:text-brand-400 hover:underline">
                      {review.job.title}
                    </Link>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Stars rating={review.rating} />
                    <span className="text-xs text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {review.title && <p className="mt-3 text-sm font-semibold text-gray-200">{review.title}</p>}
                {review.body && <p className="mt-1 text-sm leading-relaxed text-gray-400">{review.body}</p>}

                {review.responseText && (
                  <div className="mt-4 rounded-xl border border-white/8 bg-white/4 p-3">
                    <p className="text-xs font-semibold text-brand-400">Response from {tradieName.split(' ')[0]}</p>
                    <p className="mt-1 text-sm text-gray-400">{review.responseText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
