import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell, PageHeader, StatsGrid } from '@/components/shared/dashboard-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@fixit247/ui';
import { RecentJobsList } from '@/components/features/jobs/recent-jobs-list';
import { Zap } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function CustomerDashboardPage() {
  const session = await requireOnboarding();
  return (
    <DashboardShell role="CUSTOMER">
      {/* Emergency banner */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5">
        <div>
          <p className="text-sm font-medium text-brand-300">Need urgent help right now?</p>
          <p className="mt-0.5 text-xl font-bold text-white">Emergency tradie dispatch — available 24/7</p>
        </div>
        <Button asChild variant="emergency" size="lg" className="shrink-0">
          <Link href="/jobs/emergency">
            <Zap size={18} />
            Get Help Now
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Welcome back, ${session.firstName}`}
        description="Track your jobs and manage your home services"
      />

      <StatsGrid cols={4}>
        <StatCard title="Active Jobs" value="2" delta="+1 this week" trend="up" icon="🔧" />
        <StatCard title="Completed" value="14" delta="+3 this month" trend="up" icon="✅" />
        <StatCard title="Total Spent" value="$4,280" delta="AUD lifetime" icon="💳" />
        <StatCard title="Avg Rating Given" value="4.8 ★" delta="Based on 14 reviews" icon="⭐" />
      </StatsGrid>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentJobsList />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <h3 className="font-semibold text-white">Quick actions</h3>
            <div className="mt-3 space-y-1">
              {[
                { label: '🔧 Post a new job', href: '/jobs/new' },
                { label: '⚡ Emergency request', href: '/jobs/emergency' },
                { label: '❤️ Saved tradies', href: '/saved-tradies' },
                { label: '💳 Invoices', href: '/invoices' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-gray-400 hover:bg-white/6 hover:text-white transition-colors"
                >
                  {action.label}
                  <span className="text-gray-600">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
