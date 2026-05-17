import type { Metadata } from 'next';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { JobStatusTracker } from '@/components/features/jobs/job-status-tracker';
import { db } from '@fixit247/database';
import { notFound } from 'next/navigation';
import { Badge } from '@fixit247/ui';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'Job Status' };

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOnboarding();
  const { id } = await params;

  const job = await db.job.findUnique({
    where: { id },
    include: {
      address: true,
      aiInsight: true,
      claims: {
        where: { isAccepted: true },
        include: {
          tradie: {
            include: {
              user: { select: { firstName: true, lastName: true, avatarUrl: true, phone: true } },
            },
          },
        },
      },
    },
  });

  if (!job) notFound();

  const acceptedClaim = job.claims[0];
  const tradieUser = acceptedClaim?.tradie.user;

  const PRIORITY_BADGE: Record<string, 'emergency' | 'warning' | 'default'> = {
    EMERGENCY: 'emergency',
    URGENT: 'warning',
    STANDARD: 'default',
  };

  return (
    <DashboardShell role="CUSTOMER">
      <div className="mb-6">
        <Link href="/jobs" className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <ChevronLeft size={16} />
          All jobs
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{job.category.replace(/_/g, ' ')} · Posted {new Date(job.createdAt).toLocaleDateString('en-AU')}</p>
          </div>
          <Badge variant={PRIORITY_BADGE[job.priority] ?? 'default'}>{job.priority}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Status tracker */}
          <JobStatusTracker
            jobId={job.id}
            currentStatus={job.status}
            tradie={tradieUser ? {
              firstName: tradieUser.firstName,
              lastName: tradieUser.lastName,
              avatarUrl: tradieUser.avatarUrl ?? undefined,
              phone: tradieUser.phone ?? undefined,
              avgRating: acceptedClaim?.tradie.avgRating ? Number(acceptedClaim.tradie.avgRating) : undefined,
            } : null}
          />

          {/* AI insights */}
          {job.aiInsight && (
            <div className="rounded-2xl border border-brand-500/25 bg-brand-500/8 p-5">
              <p className="mb-2 text-sm font-semibold text-brand-400">AI Job Analysis</p>
              <p className="text-sm text-gray-400">{job.aiInsight.professionalSummary}</p>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>Urgency: <strong>{job.aiInsight.urgencyScore}/100</strong></span>
                <span>Confidence: <strong>{job.aiInsight.confidenceScore}%</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Job details sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <h3 className="mb-3 font-semibold text-white">Job details</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{job.description}</p>
            {job.budgetMin && (
              <div className="mt-3 border-t border-white/8 pt-3">
                <p className="text-xs text-gray-500">Budget</p>
                <p className="text-sm font-medium text-white">
                  ${job.budgetMin.toLocaleString()}
                  {job.budgetMax && ` – $${Number(job.budgetMax).toLocaleString()}`} AUD
                </p>
              </div>
            )}
            {job.address && (
              <div className="mt-3 border-t border-white/8 pt-3">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-white">
                  {job.address.suburb}, {job.address.state}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
