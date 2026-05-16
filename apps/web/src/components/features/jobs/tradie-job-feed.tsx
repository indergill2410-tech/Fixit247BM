'use client';

import * as React from 'react';
import { Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { TradieJobCard } from './tradie-job-card';
import { LiveDispatchPanel } from './live-dispatch-panel';
import { AvailabilityToggle } from './availability-toggle';
import { useSocket } from '@/hooks/use-socket';
import { cn } from '@fixit247/ui/src/lib/utils';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  isEmergency: boolean;
  budgetMin?: number | null;
  budgetMax?: number | null;
  leadPrice?: number | null;
  createdAt: string;
  address?: { suburb: string; state: string } | null;
  aiInsight?: { urgencyScore: number; confidenceScore: number } | null;
  _count?: { claims: number };
}

const CATEGORY_FILTERS = [
  'All', 'PLUMBING', 'ELECTRICAL', 'HVAC', 'LOCKSMITH', 'GLAZING',
  'CARPENTRY', 'ROOFING', 'PAINTING', 'GENERAL_MAINTENANCE',
];

export function TradieJobFeed() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [emergencyOnly, setEmergencyOnly] = React.useState(false);
  const { connected } = useSocket();

  const fetchJobs = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: 'OPEN', limit: '30' });
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      const res = await fetch(`/api/jobs?${params}`);
      if (res.ok) {
        const { jobs: fetched } = await res.json();
        setJobs(emergencyOnly ? (fetched as Job[]).filter((j) => j.isEmergency) : fetched as Job[]);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, emergencyOnly]);

  React.useEffect(() => { void fetchJobs(); }, [fetchJobs]);

  return (
    <div>
      {/* Availability toggle + connection status */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <AvailabilityToggle />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          {connected ? (
            <><Wifi size={12} className="text-green-500" /><span>Live</span></>
          ) : (
            <><WifiOff size={12} className="text-gray-400" /><span>Offline</span></>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Emergency only</span>
          </label>
          <button onClick={fetchJobs} className="ml-auto flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                categoryFilter === cat
                  ? 'bg-brand-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-300'
              )}
            >
              {cat === 'All' ? cat : cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Job list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-brand-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-semibold text-gray-900">No jobs right now</p>
          <p className="mt-1 text-sm text-gray-500">New jobs matching your trades will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <TradieJobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Live dispatch panel — appears on top when a job offer comes in */}
      <LiveDispatchPanel />
    </div>
  );
}
