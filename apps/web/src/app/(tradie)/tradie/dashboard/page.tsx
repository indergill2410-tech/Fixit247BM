import type { Metadata } from 'next';
import { requireOnboarding } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@fixit247/ui';
import { TrustScoreMeter, TrustBadge } from '@fixit247/ui';
import Link from 'next/link';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = { title: 'Tradie Dashboard' };

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

  const [incomingJobs, activeJobCount] = await Promise.all([
    db.job.findMany({
      where: { status: 'OPEN', tradieId: null },
      orderBy: [{ isEmergency: 'desc' }, { createdAt: 'desc' }],
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        budgetMin: true,
        budgetMax: true,
        isEmergency: true,
        createdAt: true,
      },
    }),
    tradieProfile
      ? db.job.count({
          where: {
            tradieId: tradieProfile.id,
            status: { in: ['CLAIMED', 'IN_PROGRESS'] },
          },
        })
      : Promise.resolve(0),
  ]);

  const trustScore = tradieProfile ? Math.round(Number(tradieProfile.trustScore)) : 0;
  const avgRating = tradieProfile ? Number(tradieProfile.avgRating) : 0;
  const totalReviews = tradieProfile?.totalReviews ?? 0;
  const completedJobs = tradieProfile?.totalJobsCompleted ?? 0;
  const totalEarnings = tradieProfile
    ? `$${Number(tradieProfile.totalEarnings).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`
    : '$0';
  const ratingDisplay = avgRating > 0 ? `${avgRating.toFixed(1)} ★` : '—';

  const hasLicence = (tradieProfile?.licences.length ?? 0) > 0;
  const hasInsurance = (tradieProfile?.insurances.length ?? 0) > 0;

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title={`G'day, ${session.firstName}`}
        description="Manage your jobs, earnings, and availability"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success">● Available</Badge>
            <Button size="sm" variant="outline">Toggle availability</Button>
          </div>
        }
      />

      <StatsGrid cols={4}>
        <StatCard title="Active Jobs" value={activeJobCount} icon="🔧" />
        <StatCard title="Total Earnings" value={totalEarnings} delta="AUD lifetime" icon="💰" />
        <StatCard
          title="Trust Score"
          value={trustScore > 0 ? `${trustScore}/100` : '—'}
          icon="⭐"
        />
        <StatCard
          title="Avg Rating"
          value={ratingDisplay}
          delta={totalReviews > 0 ? `${totalReviews} review${totalReviews === 1 ? '' : 's'}` : 'No reviews yet'}
          icon="⚡"
        />
      </StatsGrid>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Incoming jobs */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Incoming jobs</CardTitle>
              <Badge variant="warning">{incomingJobs.length} new</Badge>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-white/8">
                {incomingJobs.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium text-gray-400">No open jobs right now</p>
                    <p className="mt-1 text-xs text-gray-600">New jobs will appear here as customers post them.</p>
                  </div>
                ) : (
                  incomingJobs.map((job) => (
                    <div key={job.id} className="flex items-start justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{job.title}</p>
                          {job.isEmergency && <Badge variant="emergency">EMERGENCY</Badge>}
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{job.category.replace(/_/g, ' ')}</p>
                        <p className="mt-1 text-xs text-gray-400">{new Date(job.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 pl-4">
                        <p className="font-semibold text-white">{job.budgetMin ? `$${job.budgetMin}` : 'Quote required'}</p>
                        <Button size="sm" asChild>
                          <Link href={`/tradie/jobs/${job.id}`}>View job</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/tradie/jobs" className="mt-2 block text-center text-sm text-brand-600 hover:underline">
                View all available jobs →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
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
                <p className="text-xs text-gray-500 text-center">
                  {completedJobs > 0
                    ? `${completedJobs} completed job${completedJobs === 1 ? '' : 's'}`
                    : 'Complete your first job to build your score'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Verification status */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Verification status</CardTitle></CardHeader>
            <CardContent>
              {[
                { label: 'Identity', done: !!session.emailVerified },
                { label: 'Trade licence', done: hasLicence },
                { label: 'Insurance', done: hasInsurance },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 py-1.5">
                  {item.done
                    ? <CheckCircle size={16} className="text-green-500 shrink-0" />
                    : <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
                  <span className="text-sm text-gray-300">{item.label}</span>
                  {!item.done && <span className="ml-auto text-xs text-amber-600">Needed</span>}
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
