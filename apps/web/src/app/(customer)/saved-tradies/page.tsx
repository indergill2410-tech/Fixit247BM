import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Star, Shield, CheckCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Saved Tradies' };
export const dynamic = 'force-dynamic';

function formatTrade(trade: string) {
  return trade
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function SavedTradiesPage() {
  const session = await requireRole('CUSTOMER');

  const customerProfile = await db.customerProfile.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  // SavedTradie has no direct relation to TradieProfile in the schema —
  // resolve the tradie details in a second query (same approach the dashboard uses).
  const savedRows = customerProfile
    ? await db.savedTradie.findMany({
        where: { customerId: customerProfile.id },
        orderBy: { createdAt: 'desc' },
        select: { id: true, tradieId: true },
      })
    : [];

  const tradies = savedRows.length
    ? await db.tradieProfile.findMany({
        where: { id: { in: savedRows.map((r) => r.tradieId) } },
        select: {
          id: true,
          businessName: true,
          trades: true,
          avgRating: true,
          totalJobsCompleted: true,
          verificationStatus: true,
          user: { select: { firstName: true, lastName: true } },
        },
      })
    : [];

  // Preserve the saved-order from savedRows.
  const orderedTradies = savedRows
    .map((r) => tradies.find((t) => t.id === r.tradieId))
    .filter((t): t is (typeof tradies)[number] => t !== undefined);

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Saved Tradies"
        description="Tradies you've worked with and want to hire again"
      />

      {orderedTradies.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
          <p className="mb-3 text-4xl">❤️</p>
          <p className="font-semibold text-white">No saved tradies yet</p>
          <p className="mt-2 text-sm text-gray-500">After completing a job, you can save your favourite tradies here.</p>
          <Link
            href="/jobs/new"
            className="mt-6 rounded-xl bg-brand-400 px-6 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-300"
          >
            Post a job to get started
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedTradies.map((tradie) => {
            const name = tradie.businessName?.trim()
              ? tradie.businessName
              : `${tradie.user.firstName} ${tradie.user.lastName}`.trim();
            const initials = name
              .split(' ')
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase();
            const verified = tradie.verificationStatus === 'VERIFIED';
            const primaryTrade = tradie.trades.at(0);

            return (
              <div key={tradie.id} className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-sm font-bold text-brand-400">
                    {initials || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-white">{name}</p>
                      {verified && <Shield size={13} className="shrink-0 text-brand-400" />}
                    </div>
                    {primaryTrade && <p className="text-sm text-gray-500">{formatTrade(primaryTrade)}</p>}
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Star size={10} className="text-brand-400" />{Number(tradie.avgRating).toFixed(1)}</span>
                      <span className="flex items-center gap-1"><CheckCircle size={10} />{tradie.totalJobsCompleted} jobs</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/jobs/new?tradie=${tradie.id}`}
                    className="flex-1 rounded-xl bg-brand-400 py-2 text-center text-xs font-bold text-gray-900 transition-colors hover:bg-brand-300"
                  >
                    Hire Again
                  </Link>
                  <Link
                    href={`/tradie/${tradie.id}`}
                    className="flex-1 rounded-xl border border-white/10 py-2 text-center text-xs font-medium text-gray-400 transition-colors hover:bg-white/6 hover:text-white"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
