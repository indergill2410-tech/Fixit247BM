'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Zap, DollarSign, ChevronRight } from 'lucide-react';
import { Badge } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';
import Link from 'next/link';

interface TradieJobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    isEmergency: boolean;
    budgetMin?: number | null;
    budgetMax?: number | null;
    leadPrice?: number | null;
    createdAt: string | Date;
    address?: {
      suburb: string;
      state: string;
    } | null;
    aiInsight?: {
      urgencyScore: number;
      confidenceScore: number;
    } | null;
    _count?: { claims: number };
  };
  distanceKm?: number;
  matchScore?: number;
  onAccept?: (jobId: string) => void;
  onDecline?: (jobId: string) => void;
  isProcessing?: boolean;
  mode?: 'feed' | 'offer';  // offer = dispatched directly to this tradie
}

const CATEGORY_ICONS: Record<string, string> = {
  PLUMBING: '🔧', ELECTRICAL: '⚡', HVAC: '❄️', CARPENTRY: '🪚', PAINTING: '🎨',
  ROOFING: '🏠', TILING: '⬜', PEST_CONTROL: '🐛', LOCKSMITH: '🔐', GLAZING: '🪟',
  PLASTERING: '🧱', LANDSCAPING: '🌿', CLEANING: '🧹', APPLIANCE_REPAIR: '🔌',
  GENERAL_MAINTENANCE: '🛠️', OTHER: '🔨',
};

export function TradieJobCard({
  job,
  distanceKm,
  matchScore,
  onAccept,
  onDecline,
  isProcessing = false,
  mode = 'feed',
}: TradieJobCardProps) {
  const postedAgo = React.useMemo(() => {
    const diff = Date.now() - new Date(job.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, [job.createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border transition-colors',
        job.isEmergency ? 'border-red-500/30 bg-red-500/5 ring-1 ring-red-500/20' : 'border-white/8 bg-white/4 hover:bg-white/6'
      )}
    >
      {/* Emergency banner */}
      {job.isEmergency && (
        <div className="flex items-center gap-2 rounded-t-2xl bg-red-600 px-4 py-2">
          <Zap size={14} className="text-white" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Emergency — respond fast</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <span className="mt-0.5 text-2xl shrink-0">{CATEGORY_ICONS[job.category] ?? '🔨'}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white leading-tight">{job.title}</p>
              <p className="text-xs text-gray-500">{job.category.replace(/_/g, ' ')}</p>
            </div>
          </div>

          {/* Lead price */}
          {job.leadPrice && (
            <div className="shrink-0 text-right">
              <p className="text-xs text-gray-400">Lead price</p>
              <p className="text-lg font-bold text-brand-400">${job.leadPrice}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-3 text-sm text-gray-400 line-clamp-2">{job.description}</p>

        {/* Meta row */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {job.address && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {job.address.suburb}, {job.address.state}
              {distanceKm !== undefined && ` · ${distanceKm.toFixed(1)}km away`}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {postedAgo}
          </span>
          {(job.budgetMin || job.budgetMax) && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              {job.budgetMin && job.budgetMax
                ? `$${job.budgetMin}–$${job.budgetMax}`
                : job.budgetMax
                ? `Up to $${job.budgetMax}`
                : `From $${job.budgetMin}`}
            </span>
          )}
        </div>

        {/* AI urgency bar */}
        {job.aiInsight && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Urgency</span>
              <span>{job.aiInsight.urgencyScore}/100</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn(
                  'h-full rounded-full',
                  job.aiInsight.urgencyScore >= 80 ? 'bg-red-500' :
                  job.aiInsight.urgencyScore >= 50 ? 'bg-orange-400' : 'bg-green-400'
                )}
                style={{ width: `${job.aiInsight.urgencyScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Match score */}
        {matchScore !== undefined && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-500/10 px-3 py-2">
            <span className="text-xs font-medium text-brand-400">Match score: {matchScore.toFixed(0)}/100</span>
            {matchScore >= 80 && <span className="ml-auto text-xs text-brand-400">⭐ Great fit</span>}
          </div>
        )}

        {/* Actions */}
        {mode === 'offer' && onAccept && onDecline ? (
          <div className="flex gap-2">
            <button
              onClick={() => { onDecline(job.id); }}
              disabled={isProcessing}
              className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/6 hover:text-white disabled:opacity-50 transition-colors"
            >
              Decline
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { onAccept(job.id); }}
              disabled={isProcessing}
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50',
                job.isEmergency ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'
              )}
            >
              {isProcessing ? 'Processing…' : job.isEmergency ? '🚨 Accept Emergency' : 'Accept Job'}
            </motion.button>
          </div>
        ) : (
          <Link
            href={`/tradie/jobs/${job.id}`}
            className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/6 hover:text-white transition-colors"
          >
            <span>View details</span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
