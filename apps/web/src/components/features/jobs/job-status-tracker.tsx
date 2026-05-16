'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Truck, Wrench, Star, XCircle } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';
import { useRealTimeJob } from '@/hooks/use-real-time-job';

interface JobStatusTrackerProps {
  jobId: string;
  currentStatus: string;
  tradie?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    avgRating?: number;
    phone?: string;
  } | null;
  etaMinutes?: number | null;
  className?: string;
}

const STATUS_STEPS = [
  { status: 'OPEN', label: 'Job Posted', icon: Clock, description: 'Finding the best tradie for you...' },
  { status: 'CLAIMED', label: 'Tradie Accepted', icon: CheckCircle, description: 'A tradie has accepted your job' },
  { status: 'EN_ROUTE', label: 'En Route', icon: Truck, description: 'Tradie is on the way to you' },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: Wrench, description: 'Work is underway' },
  { status: 'COMPLETED', label: 'Completed', icon: Star, description: 'Job complete! Please leave a review' },
];

const STATUS_ORDER = ['OPEN', 'CLAIMED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'];

export function JobStatusTracker({ jobId, currentStatus, tradie, etaMinutes: initialEta, className }: JobStatusTrackerProps) {
  const { latestUpdate, etaMinutes: realtimeEta } = useRealTimeJob(jobId);
  const effectiveStatus = latestUpdate?.status ?? currentStatus;
  const effectiveEta = realtimeEta ?? initialEta;

  const currentIdx = STATUS_ORDER.indexOf(effectiveStatus);
  const isCancelled = effectiveStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className={cn('rounded-2xl border border-red-200 bg-red-50 p-5', className)}>
        <div className="flex items-center gap-3">
          <XCircle size={24} className="text-red-500" />
          <div>
            <p className="font-semibold text-red-700">Job Cancelled</p>
            <p className="text-sm text-red-500">This job has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border border-gray-200 bg-white p-5', className)}>
      <h3 className="mb-4 font-semibold text-gray-900">Job Status</h3>

      {/* ETA pill */}
      {effectiveEta && effectiveEta > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5">
          <Truck size={16} className="text-brand-600" />
          <p className="text-sm font-medium text-brand-700">Tradie arriving in ~{effectiveEta} minutes</p>
        </div>
      )}

      {/* Tradie card */}
      {tradie && currentIdx >= 1 && (
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold shrink-0">
            {tradie.firstName[0]}{tradie.lastName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900">{tradie.firstName} {tradie.lastName}</p>
            {tradie.avgRating && (
              <p className="text-xs text-gray-500">⭐ {tradie.avgRating.toFixed(1)} rating</p>
            )}
          </div>
          {tradie.phone && (
            <a
              href={`tel:${tradie.phone}`}
              className="rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              Call
            </a>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-0">
        {STATUS_STEPS.map((step, idx) => {
          const isDone = currentIdx > idx;
          const isCurrent = currentIdx === idx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isDone ? '#2563eb' : isCurrent ? '#eff6ff' : '#f9fafb',
                    borderColor: isDone || isCurrent ? '#2563eb' : '#e5e7eb',
                  }}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  )}
                >
                  <Icon size={14} className={isDone ? 'text-white' : isCurrent ? 'text-brand-600' : 'text-gray-400'} />
                </motion.div>
                {idx < STATUS_STEPS.length - 1 && (
                  <div className={cn('my-1 w-0.5 flex-1 transition-colors', isDone ? 'bg-brand-600' : 'bg-gray-200')} style={{ minHeight: 24 }} />
                )}
              </div>
              <div className="pb-4 pt-1 min-w-0 flex-1">
                <p className={cn('text-sm font-semibold', isDone || isCurrent ? 'text-gray-900' : 'text-gray-400')}>
                  {step.label}
                </p>
                {isCurrent && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-brand-600"
                  >
                    {step.description}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
