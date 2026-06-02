import type { Metadata } from 'next';
import { requireOnboarding } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@fixit247/ui';
import { TrustScoreMeter, TrustBadge } from '@fixit247/ui';
import Link from 'next/link';
import { FxIcon } from '@/components/ui/fx-icon';
import { AvailabilityToggle } from '@/components/features/jobs/availability-toggle';
import { CreditsChip } from '@/components/features/dashboard/credits-chip';
import { TradieOffersFeed } from '@/components/features/dashboard/tradie-offers-feed';

export const metadata: Metadata = { title: 'Tradie Dashboard' };

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export default async function TradieDashboardPage() {
  const session = await requireOnboarding();

  const tradieProfile = await db.tradieProfile.findUnique({
    where: { userId: session.id },
    select: {
      id: true,
      avgRating: true,
      totalReviews: true,
      totalJobsCompleted: true,
      totalEarnings: true,
      trustScore: true,
      trustBadges: true,
      completionRate: true,
      responseTimeMinutes: true,
      licences: { select: { id: true } },
      insurances: { select: { id: true } },
    },
  });

  const [activeJobCount, activeJobs, payments] = await Promise.all([
    tradieProfile
      ? db.job.count({
          where: { tradieId: tradieProfile.id, status: { in: ['CLAIMED', 'IN_PROGRESS'] } },
        })
      : Promise.resolve(0),
    tradieProfile
      ? db.job.findMany({
          where: { tradieId: tradieProfile.id, status: { in: ['CLAIMED', 'IN_PROGRESS'] } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
            isEmergency: true,
            createdAt: true,
          },
        })
      : Promise.resolve([]),
    tradieProfile
      ? db.payment.findMany({
          where: { tradieId: tradieProfile.id, status: 'RELEASED' },
          select: { amount: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 200,
        })
      : Promise.resolve([]),
  ]);

  const trustScore = tradieProfile ? Math.round(Number(tradieProfile.trustScore)) : 0;
  const avgRating = tradieProfile ? Number(tradieProfile.avgRating) : 0;
  const totalReviews = tradieProfile?.totalReviews ?? 0;
  const completedJobs = tradieProfile?.totalJobsCompleted ?? 0;
  const ratingDisplay = avgRating > 0 ? `${avgRating.toFixed(1)} ★` : '—';

  const hasLicence = (tradieProfile?.licences.length ?? 0) > 0;
  const hasInsurance = (tradieProfile?.insurances.length ?? 0) > 0;

  // --- Earnings: last 7 days daily buckets + week-over-week ---
  const now = new Date();
  const todayStart = startOfDay(now);
  const dayMs = 24 * 60 * 60 * 1000;

  const dailyEarnings: { label: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = todayStart - i * dayMs;
    const dayEnd = dayStart + dayMs;
    const total = payments
      .filter((p) => {
        const t = new Date(p.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);
    dailyEarnings.push({
      label: new Date(dayStart).toLocaleDateString('en-AU', { weekday: 'short' }),
      total,
    });
  }

  const thisWeekStart = todayStart - 6 * dayMs;
  const lastWeekStart = thisWeekStart - 7 * dayMs;
  const thisWeekTotal = payments
    .filter((p) => new Date(p.createdAt).getTime() >= thisWeekStart)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const lastWeekTotal = payments
    .filter((p) => {
      const t = new Date(p.createdAt).getTime();
      return t >= lastWeekStart && t < thisWeekStart;
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const weekDelta =
    lastWeekTotal > 0
      ? `${thisWeekTotal >= lastWeekTotal ? '+' : ''}${Math.round(
          ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100,
        )}% vs last week`
      : thisWeekTotal > 0
        ? 'New this week'
        : 'No earnings yet';
  const weekTrend: 'up' | 'down' | 'neutral' =
    thisWeekTotal > lastWeekTotal ? 'up' : thisWeekTotal < lastWeekTotal ? 'down' : 'neutral';

  const fmtCurrency = (n: number) =>
    `$${n.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;

  const maxDaily = Math.max(1, ...dailyEarnings.map((d) => d.total));

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title={`G'day, ${session.firstName}`}
        description="Manage your jobs, earnings, and availability"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AvailabilityToggle />
            <CreditsChip />
          </div>
        }
      />

      <StatsGrid cols={4}>
        <StatCard
          title="Active Jobs"
          value={activeJobCount}
          color="amber"
          icon={<FxIcon name="wrench" size={18} />}
        />
        <StatCard
          title="This Week"
          value={fmtCurrency(thisWeekTotal)}
          color="green"
          trend={weekTrend}
          delta={weekDelta}
          icon={<FxIcon name="dollar" size={18} />}
        />
        <StatCard
          title="Trust Score"
          value={trustScore > 0 ? `${trustScore}/100` : '—'}
          color="blue"
          icon={<FxIcon name="shield" size={18} />}
        />
        <StatCard
          title="Avg Rating"
          value={ratingDisplay}
          color="amber"
          delta={totalReviews > 0 ? `${totalReviews} review${totalReviews === 1 ? '' : 's'}` : 'No reviews yet'}
          icon={<FxIcon name="star" size={18} />}
        />
      </StatsGrid>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <TradieOffersFeed />

          {/* Active jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active jobs</CardTitle>
              {activeJobs.length > 0 && <Badge variant="success">{activeJobs.length}</Badge>}
            </CardHeader>
            <CardContent>
              {activeJobs.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium text-foreground-muted">No active jobs</p>
                  <p className="mt-1 text-xs text-foreground-subtle">
                    Accept an offer above to start working.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {activeJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/tradie/jobs/${job.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-background-alt -mx-2 px-2 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-foreground">{job.title}</p>
                          {job.isEmergency && <Badge variant="emergency">EMERGENCY</Badge>}
                        </div>
                        <p className="mt-0.5 text-xs text-foreground-muted">
                          {job.category.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === 'IN_PROGRESS' ? 'warning' : 'default'}>
                          {job.status.replace(/_/g, ' ')}
                        </Badge>
                        <FxIcon name="arrowRight" size={16} className="text-foreground-subtle" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          {/* Trust score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3">
                <TrustScoreMeter score={trustScore} size="lg" />
                <div className="flex flex-wrap justify-center gap-2">
                  {(tradieProfile?.trustBadges ?? []).map((badge) => (
                    <TrustBadge key={badge} variant={badge as never} />
                  ))}
                </div>
                <p className="text-center text-xs text-foreground-muted">
                  {completedJobs > 0
                    ? `${completedJobs} completed job${completedJobs === 1 ? '' : 's'}`
                    : 'Complete your first job to build your score'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7-day earnings sparkline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">7-day earnings</CardTitle>
              <span className="text-sm font-semibold text-foreground">{fmtCurrency(thisWeekTotal)}</span>
            </CardHeader>
            <CardContent>
              <div className="flex h-24 items-end gap-1.5">
                {dailyEarnings.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t bg-brand-500/80 transition-all"
                        style={{ height: `${Math.max(4, (d.total / maxDaily) * 100)}%` }}
                        title={`${d.label}: ${fmtCurrency(d.total)}`}
                      />
                    </div>
                    <span className="text-[10px] text-foreground-subtle">{d.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Verification status</CardTitle>
            </CardHeader>
            <CardContent>
              {[
                { label: 'Identity', done: !!session.emailVerified },
                { label: 'Trade licence', done: hasLicence },
                { label: 'Insurance', done: hasInsurance },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 py-1.5">
                  {item.done ? (
                    <FxIcon name="checkCircle" size={16} className="shrink-0 text-emerald-500" />
                  ) : (
                    <FxIcon name="alertTriangle" size={16} className="shrink-0 text-brand-500" />
                  )}
                  <span className="text-sm text-foreground-secondary">{item.label}</span>
                  {!item.done && <span className="ml-auto text-xs text-brand-500">Needed</span>}
                </div>
              ))}
              <Button asChild size="sm" className="mt-3 w-full" variant="outline">
                <Link href="/tradie/documents">Complete verification →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
