import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@fixit247/ui';
import { RecentJobsList } from '@/components/features/jobs/recent-jobs-list';
import { FxIcon } from '@/components/ui/fx-icon';
import { CustomerActiveJobTracker } from '@/components/features/dashboard/customer-active-job-tracker';

export const metadata: Metadata = { title: 'Dashboard' };

const ACTIVE_STATUSES = ['CLAIMED', 'IN_PROGRESS'] as const;

// Step tracker maps the real JobStatus enum (no EN_ROUTE/ARRIVED in schema).
const JOB_STEPS = [
  { key: 'CLAIMED', label: 'Claimed' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'COMPLETED', label: 'Done' },
] as const;

function formatAud(value: number) {
  return `$${value.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

export default async function CustomerDashboardPage() {
  const session = await requireOnboarding();

  const [customerProfile, subscription, reviewsGiven] = await Promise.all([
    db.customerProfile.findUnique({
      where: { userId: session.id },
      select: { id: true, totalSpent: true },
    }),
    db.subscription.findUnique({
      where: { userId: session.id },
      select: { tier: true, status: true, currentPeriodEnd: true },
    }),
    db.review.count({ where: { reviewerId: session.id } }),
  ]);
  void reviewsGiven;

  const profileId = customerProfile?.id;

  const [activeCount, completedCount, activeJob, completedJobs, savedRows] = await Promise.all([
    profileId
      ? db.job.count({ where: { customerId: profileId, status: { in: [...ACTIVE_STATUSES] } } })
      : Promise.resolve(0),
    profileId
      ? db.job.count({ where: { customerId: profileId, status: 'COMPLETED' } })
      : Promise.resolve(0),
    profileId
      ? db.job.findFirst({
          where: { customerId: profileId, status: { in: [...ACTIVE_STATUSES] } },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            tradie: {
              select: {
                avgRating: true,
                businessName: true,
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        })
      : Promise.resolve(null),
    profileId
      ? db.job.findMany({
          where: {
            customerId: profileId,
            status: 'COMPLETED',
            completedAt: { not: null },
          },
          select: { completedAt: true, budgetMax: true, budgetMin: true, tradieEarnings: true },
        })
      : Promise.resolve([]),
    profileId
      ? db.savedTradie.findMany({
          where: { customerId: profileId },
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: { id: true, tradieId: true },
        })
      : Promise.resolve([]),
  ]);

  // Resolve saved tradie details (no direct relation in schema).
  const savedTradies = savedRows.length
    ? await db.tradieProfile.findMany({
        where: { id: { in: savedRows.map((r) => r.tradieId) } },
        select: {
          id: true,
          avgRating: true,
          businessName: true,
          user: { select: { firstName: true, lastName: true } },
        },
      })
    : [];

  const totalSpentNum = customerProfile?.totalSpent ? Number(customerProfile.totalSpent) : 0;

  // Build last 6 months of completed-job spend.
  const now = new Date();
  const months: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleString('en-AU', { month: 'short' }), total: 0 });
  }
  for (const job of completedJobs) {
    if (!job.completedAt) continue;
    const c = new Date(job.completedAt);
    const idx = months.findIndex((_, k) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - k), 1);
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
    });
    if (idx >= 0) {
      const amount = job.tradieEarnings
        ? Number(job.tradieEarnings)
        : job.budgetMax
          ? Number(job.budgetMax)
          : job.budgetMin
            ? Number(job.budgetMin)
            : 0;
      months[idx].total += amount;
    }
  }
  const maxMonth = Math.max(1, ...months.map((m) => m.total));

  const isMember =
    !!subscription && subscription.tier !== 'FREE' && subscription.status === 'ACTIVE';

  const tradieName = activeJob?.tradie
    ? `${activeJob.tradie.user.firstName} ${activeJob.tradie.user.lastName}`.trim()
    : null;
  const tradieRating = activeJob?.tradie ? Number(activeJob.tradie.avgRating) : 0;
  const currentStepIdx = activeJob
    ? Math.max(0, JOB_STEPS.findIndex((s) => s.key === activeJob.status))
    : -1;

  return (
    <DashboardShell role="CUSTOMER">
      {/* A. Active job hero OR emergency banner */}
      {activeJob ? (
        <div className="mb-6 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                Active job
              </p>
              <h2 className="mt-1 truncate text-xl font-bold text-foreground">{activeJob.title}</h2>
              {tradieName ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground-muted">
                  <span className="flex items-center gap-1.5">
                    <FxIcon name="user" size={15} className="text-foreground-subtle" />
                    {tradieName}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FxIcon
                        key={n}
                        name="star"
                        size={14}
                        className={n <= Math.round(tradieRating) ? 'text-brand-500' : 'text-foreground-subtle/40'}
                      />
                    ))}
                    <span className="ml-1 text-xs text-foreground-subtle">{tradieRating.toFixed(1)}</span>
                  </span>
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-foreground-subtle">Awaiting tradie assignment</p>
              )}
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href={`/jobs/${activeJob.id}`}>
                <FxIcon name="mapPin" size={18} />
                Track live
              </Link>
            </Button>
          </div>

          {/* Step tracker */}
          <div className="mt-5 flex items-center">
            {JOB_STEPS.map((step, i) => {
              const done = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={[
                        'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                        done
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-border bg-background-elevated text-foreground-subtle',
                        isCurrent ? 'ring-2 ring-brand-500/30' : '',
                      ].join(' ')}
                    >
                      {done ? <FxIcon name="checkCircle" size={16} /> : i + 1}
                    </div>
                    <span
                      className={`mt-1.5 whitespace-nowrap text-[11px] font-medium ${
                        done ? 'text-foreground' : 'text-foreground-subtle'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < JOB_STEPS.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full ${
                        i < currentStepIdx ? 'bg-brand-500' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {activeJob.status === 'CLAIMED' && <CustomerActiveJobTracker jobId={activeJob.id} />}
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-300">
              Need urgent help right now?
            </p>
            <p className="mt-0.5 text-xl font-bold text-foreground">
              Emergency tradie dispatch — available 24/7
            </p>
          </div>
          <Button asChild variant="emergency" size="lg" className="shrink-0">
            <Link href="/jobs/emergency">
              <FxIcon name="zap" size={18} />
              Get Help Now
            </Link>
          </Button>
        </div>
      )}

      {/* B. Page header */}
      <PageHeader
        title={`Welcome back, ${session.firstName}`}
        description="Track your jobs and manage your home services"
      />

      {/* C. Stat row */}
      <StatsGrid cols={4}>
        <StatCard
          title="Active Jobs"
          value={activeCount}
          color="amber"
          icon={<FxIcon name="wrench" size={20} />}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          color="green"
          icon={<FxIcon name="checkCircle" size={20} />}
        />
        <StatCard
          title="Total Spent"
          value={formatAud(totalSpentNum)}
          delta="AUD lifetime"
          color="blue"
          icon={<FxIcon name="creditCard" size={20} />}
        />
        {isMember ? (
          <StatCard
            title="Fixit Plus"
            value={subscription!.tier.charAt(0) + subscription!.tier.slice(1).toLowerCase()}
            delta="Active member"
            color="amber"
            highlight
            icon={<FxIcon name="shield" size={20} />}
          />
        ) : (
          <Link href="/fixit-plus" className="block transition-transform hover:-translate-y-0.5">
            <StatCard
              title="Fixit Plus"
              value="Not a member"
              delta="Upgrade →"
              color="default"
              icon={<FxIcon name="shield" size={20} />}
            />
          </Link>
        )}
      </StatsGrid>

      {/* D. Two-column grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentJobsList />

          {/* Spend this month mini bar chart */}
          <div className="rounded-2xl border border-border bg-background-elevated p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Spend this month</h3>
              <span className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                <FxIcon name="barChart" size={14} />
                Last 6 months
              </span>
            </div>
            <div className="mt-5 flex h-32 items-end justify-between gap-2">
              {months.map((m) => {
                const pct = Math.round((m.total / maxMonth) * 100);
                return (
                  <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-brand-500/80 transition-all hover:bg-brand-500"
                        style={{ height: `${m.total > 0 ? Math.max(pct, 6) : 2}%` }}
                        title={formatAud(m.total)}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-foreground-subtle">{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="rounded-2xl border border-border bg-background-elevated p-5">
            <h3 className="font-semibold text-foreground">Quick actions</h3>
            <div className="mt-3 space-y-1">
              {[
                { label: 'Post a new job', icon: 'plus' as const, href: '/jobs/new' },
                { label: 'Emergency request', icon: 'zap' as const, href: '/jobs/emergency' },
                { label: 'Saved tradies', icon: 'star' as const, href: '/saved-tradies' },
                { label: 'Invoices', icon: 'receipt' as const, href: '/invoices' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-background-alt hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <FxIcon name={action.icon} size={16} />
                    {action.label}
                  </span>
                  <FxIcon name="arrowRight" size={14} className="text-foreground-subtle" />
                </Link>
              ))}
            </div>
          </div>

          {/* Saved tradies preview OR upsell */}
          {savedTradies.length > 0 ? (
            <div className="rounded-2xl border border-border bg-background-elevated p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Saved tradies</h3>
                <Link href="/saved-tradies" className="text-xs font-medium text-brand-500 hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-3 space-y-2">
                {savedTradies.map((t) => {
                  const name = t.businessName?.trim()
                    ? t.businessName
                    : `${t.user.firstName} ${t.user.lastName}`.trim();
                  const initials = name
                    .split(' ')
                    .map((p) => p[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  return (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl p-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-600 dark:text-brand-300">
                        {initials || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{name}</p>
                        <p className="flex items-center gap-1 text-xs text-foreground-subtle">
                          <FxIcon name="star" size={12} className="text-brand-500" />
                          {Number(t.avgRating).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            !isMember && (
              <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5">
                <FxIcon name="shield" size={22} className="text-brand-500" />
                <h3 className="mt-2 font-semibold text-foreground">Why Fixit Plus?</h3>
                <p className="mt-1 text-sm text-foreground-muted">
                  Priority dispatch, exclusive rates, and 24/7 emergency cover for your home.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link href="/fixit-plus">
                    Explore Fixit Plus
                    <FxIcon name="arrowRight" size={14} />
                  </Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>

      {/* E. Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-background-elevated p-3 sm:hidden">
        <Button asChild className="flex-1">
          <Link href="/jobs/new">
            <FxIcon name="plus" size={16} />
            Post a job
          </Link>
        </Button>
        <Button asChild variant="emergency" className="flex-1">
          <Link href="/jobs/emergency">
            <FxIcon name="zap" size={16} />
            Emergency
          </Link>
        </Button>
      </div>
    </DashboardShell>
  );
}
