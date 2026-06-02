import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@fixit247/ui';
import { RecentJobsList } from '@/components/features/jobs/recent-jobs-list';
import { FxIcon } from '@/components/ui/fx-icon';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function CustomerDashboardPage() {
  const session = await requireOnboarding();

  const customerProfile = await db.customerProfile.findUnique({
    where: { userId: session.id },
    select: {
      id: true,
      totalSpent: true,
    },
  });

  const [activeCount, completedCount, reviewsGiven] = await Promise.all([
    customerProfile
      ? db.job.count({
          where: {
            customerId: customerProfile.id,
            status: { in: ['OPEN', 'CLAIMED', 'IN_PROGRESS'] },
          },
        })
      : Promise.resolve(0),
    customerProfile
      ? db.job.count({
          where: { customerId: customerProfile.id, status: 'COMPLETED' },
        })
      : Promise.resolve(0),
    db.review.count({ where: { reviewerId: session.id } }),
  ]);

  const totalSpent = customerProfile?.totalSpent
    ? `$${Number(customerProfile.totalSpent).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`
    : '$0';

  return (
    <DashboardShell role="CUSTOMER">
      {/* Emergency banner */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5">
        <div>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-300">Need urgent help right now?</p>
          <p className="mt-0.5 text-xl font-bold text-foreground">Emergency tradie dispatch — available 24/7</p>
        </div>
        <Button asChild variant="emergency" size="lg" className="shrink-0">
          <Link href="/jobs/emergency">
            <FxIcon name="zap" size={18} />
            Get Help Now
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Welcome back, ${session.firstName}`}
        description="Track your jobs and manage your home services"
      />

      <StatsGrid cols={4}>
        <StatCard title="Active Jobs" value={activeCount} icon={<FxIcon name="wrench" size={20} />} />
        <StatCard title="Completed" value={completedCount} icon={<FxIcon name="checkCircle" size={20} />} />
        <StatCard title="Total Spent" value={totalSpent} delta="AUD lifetime" icon={<FxIcon name="creditCard" size={20} />} />
        <StatCard
          title="Reviews Given"
          value={reviewsGiven > 0 ? reviewsGiven : '—'}
          delta={reviewsGiven > 0 ? `${reviewsGiven} review${reviewsGiven === 1 ? '' : 's'}` : 'No reviews yet'}
          icon={<FxIcon name="star" size={20} />}
        />
      </StatsGrid>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentJobsList />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-background-elevated p-5">
            <h3 className="font-semibold text-foreground">Quick actions</h3>
            <div className="mt-3 space-y-1">
              {[
                { label: 'Post a new job', icon: 'wrench' as const, href: '/jobs/new' },
                { label: 'Emergency request', icon: 'zap' as const, href: '/jobs/emergency' },
                { label: 'Saved tradies', icon: 'star' as const, href: '/saved-tradies' },
                { label: 'Invoices', icon: 'receipt' as const, href: '/invoices' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-foreground-muted hover:bg-background-alt hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FxIcon name={action.icon} size={16} />
                    {action.label}
                  </span>
                  <FxIcon name="arrowRight" size={16} className="text-foreground-subtle" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
