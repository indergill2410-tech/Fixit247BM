import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { db } from '@fixit247/database';
import { notFound } from 'next/navigation';
import { Badge } from '@fixit247/ui';
import Link from 'next/link';
import { ChevronLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { TradieJobActions } from '@/components/features/jobs/tradie-job-actions';

export const metadata: Metadata = { title: 'Job Details' };

export default async function TradieJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('TRADIE');
  const { id } = await params;

  const job = await db.job.findUnique({
    where: { id },
    include: {
      address: true,
      aiInsight: true,
      images: true,
      claims: { where: { isAccepted: true }, take: 1 },
    },
  });

  if (!job) notFound();

  const hasAccepted = job.claims.length > 0;

  return (
    <DashboardShell role="TRADIE">
      <div className="mb-6">
        <Link href="/tradie/jobs" className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <ChevronLeft size={16} />
          Back to jobs
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {job.category.replace(/_/g, ' ')} · Posted {new Date(job.createdAt).toLocaleDateString('en-AU')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {job.isEmergency && <Badge variant="emergency">EMERGENCY</Badge>}
            <Badge variant={job.status === 'OPEN' ? 'success' : 'default'}>{job.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <h2 className="mb-3 font-semibold text-white">Job description</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{job.description}</p>
          </div>

          {/* AI insights */}
          {job.aiInsight && (
            <div className="rounded-2xl border border-brand-500/25 bg-brand-500/8 p-5">
              <p className="mb-2 text-sm font-semibold text-brand-400">✨ AI Scope Analysis</p>
              <p className="mb-3 text-sm text-gray-400">{job.aiInsight.professionalSummary}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>Urgency: <strong className="text-white">{job.aiInsight.urgencyScore}/100</strong></span>
                <span>Confidence: <strong className="text-white">{job.aiInsight.confidenceScore}%</strong></span>
                <span>Complexity: <strong className="text-white">{job.aiInsight.complexity}</strong></span>
              </div>
              {job.aiInsight.suggestedMaterials.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs text-gray-500">Suggested materials:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.aiInsight.suggestedMaterials.map((m) => (
                      <span key={m} className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-xs text-brand-400">{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <TradieJobActions
            jobId={job.id}
            status={job.status}
            isEmergency={job.isEmergency}
            budgetMax={job.budgetMax ? Number(job.budgetMax) : null}
            budgetMin={job.budgetMin ? Number(job.budgetMin) : null}
            hasAccepted={hasAccepted}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Job meta */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5 space-y-3">
            <h3 className="font-semibold text-white">Job details</h3>

            {job.address && (
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
                <span>{job.address.street}, {job.address.suburb} {job.address.state} {job.address.postcode}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} className="shrink-0 text-gray-500" />
              <span>{new Date(job.createdAt).toLocaleString('en-AU')}</span>
            </div>

            {(job.budgetMin || job.budgetMax) && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <DollarSign size={16} className="shrink-0 text-gray-500" />
                <span>
                  {job.budgetMin && job.budgetMax
                    ? `$${Number(job.budgetMin).toLocaleString()} – $${Number(job.budgetMax).toLocaleString()} AUD`
                    : job.budgetMax
                    ? `Up to $${Number(job.budgetMax).toLocaleString()} AUD`
                    : `From $${Number(job.budgetMin).toLocaleString()} AUD`}
                </span>
              </div>
            )}

            {job.leadPrice && (
              <div className="border-t border-white/8 pt-3">
                <p className="text-xs text-gray-500">Lead price (deducted from wallet)</p>
                <p className="text-xl font-bold text-brand-400">${Number(job.leadPrice).toFixed(2)} AUD</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
