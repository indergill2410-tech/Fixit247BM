import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Star, MapPin, Shield } from 'lucide-react';

export const metadata: Metadata = { title: 'Saved Tradies' };

const MOCK_SAVED = [
  { id: '1', name: 'Chris Nguyen', trade: 'Plumber', suburb: 'Bondi, NSW', rating: 4.9, jobs: 3, verified: true, avatar: 'CN' },
  { id: '2', name: 'James Sullivan', trade: 'Electrician', suburb: 'Surry Hills, NSW', rating: 5.0, jobs: 1, verified: true, avatar: 'JS' },
  { id: '3', name: 'Tony Morales', trade: 'Locksmith', suburb: 'Newtown, NSW', rating: 4.8, jobs: 2, verified: true, avatar: 'TM' },
];

export default async function SavedTradiesPage() {
  await requireOnboarding();

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Saved Tradies"
        description="Tradies you've worked with and want to hire again"
      />

      {MOCK_SAVED.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
          <p className="text-4xl mb-3">❤️</p>
          <p className="font-semibold text-white">No saved tradies yet</p>
          <p className="mt-2 text-sm text-gray-500">After completing a job, you can save your favourite tradies here.</p>
          <Link
            href="/jobs/new"
            className="mt-6 rounded-xl bg-brand-400 px-6 py-2.5 text-sm font-bold text-gray-900 hover:bg-brand-300 transition-colors"
          >
            Post a job to get started
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_SAVED.map((tradie) => (
            <div key={tradie.id} className="rounded-2xl border border-white/8 bg-white/4 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-sm font-bold text-brand-400">
                  {tradie.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white truncate">{tradie.name}</p>
                    {tradie.verified && <Shield size={13} className="shrink-0 text-brand-400" />}
                  </div>
                  <p className="text-sm text-gray-500">{tradie.trade}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={10} />{tradie.suburb}</span>
                    <span className="flex items-center gap-1"><Star size={10} className="text-brand-400" />{tradie.rating}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/jobs/new?tradie=${tradie.id}`}
                  className="flex-1 rounded-xl bg-brand-400 py-2 text-center text-xs font-bold text-gray-900 hover:bg-brand-300 transition-colors"
                >
                  Hire Again
                </Link>
                <Link
                  href={`/tradie/${tradie.id}`}
                  className="flex-1 rounded-xl border border-white/10 py-2 text-center text-xs font-medium text-gray-400 hover:bg-white/6 hover:text-white transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
