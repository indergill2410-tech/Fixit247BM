'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { ChatWindow } from '@/components/features/chat/chat-window';
import { LiveTrackingMap } from '@/components/features/tracking/live-tracking-map';
import { FindingTradieScreen } from '@/components/features/dispatch/finding-tradie-screen';
import { PaymentConfirmation } from '@/components/features/payments/payment-confirmation';
import { useJobSubscription, useRealTimeJobStatus } from '@/lib/socket/hooks';

const JOB_STATUS_STEPS = [
  { key: 'POSTED',     label: 'Posted',          icon: '📋' },
  { key: 'MATCHING',   label: 'Finding tradie',   icon: '🔍' },
  { key: 'CLAIMED',    label: 'Tradie assigned',  icon: '✅' },
  { key: 'EN_ROUTE',   label: 'On the way',       icon: '🚗' },
  { key: 'ARRIVED',    label: 'Arrived',          icon: '📍' },
  { key: 'IN_PROGRESS',label: 'In progress',      icon: '🔧' },
  { key: 'COMPLETED',  label: 'Completed',        icon: '🎉' },
];

const STATUS_ORDER = JOB_STATUS_STEPS.map((s) => s.key);

interface Props {
  job: {
    id: string; title: string; status: string; isEmergency: boolean; priority: string;
    address: string; suburb: string; latitude: number | null; longitude: number | null;
    tradieId: string | null; tradieName: string | null; tradieRating: number | null;
    createdAt: string; completedAt: string | null;
  };
  currentUser: { id: string; name: string; role: string };
  initialEvents: { id: string; type: string; createdAt: string; metadata: Record<string, unknown> | null }[];
}

export function CustomerJobDetailClient({ job, currentUser, initialEvents: _ }: Props) {
  const [activeTab, setActiveTab] = useState<'status' | 'map' | 'chat'>('status');
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  useJobSubscription(job.id);
  const { status } = useRealTimeJobStatus(job.id, job.status);

  const currentStepIndex = STATUS_ORDER.indexOf(status);
  const isSearching = ['OPEN', 'MATCHING'].includes(status);
  const isActive = ['CLAIMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(status);
  const isCompleted = status === 'COMPLETED';

  const TABS = [
    { key: 'status', label: 'Status', icon: Clock },
    ...(isActive || isCompleted ? [{ key: 'map', label: 'Map', icon: MapPin }, { key: 'chat', label: 'Chat', icon: MessageCircle }] : []),
  ] as const;

  return (
    <DashboardShell>
      {/* Job header */}
      <div className={`mb-6 rounded-2xl p-6 ${job.isEmergency ? 'bg-red-900 text-white' : 'bg-gray-900 text-white'}`}>
        <div className="flex items-start justify-between">
          <div>
            {job.isEmergency && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                Emergency
              </span>
            )}
            <h1 className="text-xl font-bold">{job.title}</h1>
            <p className="mt-1 text-sm text-white/60">{job.suburb} · Posted {new Date(job.createdAt).toLocaleDateString('en-AU')}</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">{status.replace('_', ' ')}</span>
        </div>

        {job.tradieName && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">
              {job.tradieName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{job.tradieName}</p>
              {job.tradieRating && (
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white/70">{job.tradieRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Finding tradie screen */}
      {isSearching && (
        <div className="mb-6">
          <FindingTradieScreen jobId={job.id} isEmergency={job.isEmergency} />
        </div>
      )}

      {/* Status timeline */}
      {!isSearching && (
        <div className="mb-6 rounded-2xl border border-white/8 bg-white/4 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Job Progress</h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
            <div
              className="absolute left-4 top-4 w-0.5 bg-brand-500 transition-all duration-700"
              style={{ height: `${(currentStepIndex / (JOB_STATUS_STEPS.length - 1)) * 100}%` }}
            />

            <div className="space-y-4">
              {JOB_STATUS_STEPS.map((step, i) => {
                const done = i <= currentStepIndex;
                const active = i === currentStepIndex;
                return (
                  <motion.div
                    key={step.key}
                    className="flex items-center gap-4"
                    initial={false}
                    animate={{ opacity: done ? 1 : 0.4 }}
                  >
                    <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base z-10 ${
                      active ? 'bg-brand-500 ring-4 ring-brand-100 scale-110' : done ? 'bg-brand-500' : 'bg-gray-100'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${done ? 'text-white' : 'text-gray-400'}`}>{step.label}</p>
                    </div>
                    {active && <span className="text-xs text-brand-500 font-medium">Now</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab bar (when tradie active) */}
      {(isActive || isCompleted) && (
        <>
          <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key ? 'bg-brand-500/15 text-brand-400' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="h-96">
            {activeTab === 'map' && job.latitude && job.longitude && (
              <LiveTrackingMap
                jobId={job.id}
                jobLatitude={job.latitude}
                jobLongitude={job.longitude}
                jobAddress={job.address}
              />
            )}
            {activeTab === 'chat' && job.tradieId && (
              <ChatWindow
                jobId={job.id}
                currentUserId={currentUser.id}
                currentUserName={currentUser.name}
                participantName={job.tradieName ?? 'Tradie'}
              />
            )}
            {activeTab === 'status' && (
              <div className="flex h-full items-center justify-center rounded-2xl bg-white/4 text-sm text-gray-400">
                Job timeline shown above
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirm completion */}
      {status === 'IN_PROGRESS' && !showPaymentConfirm && (
        <div className="mt-6">
          <Button
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
            onClick={() => setShowPaymentConfirm(true)}
          >
            Job Complete — Release Payment
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {showPaymentConfirm && job.tradieName && (
        <div className="mt-6">
          <PaymentConfirmation
            jobId={job.id}
            tradieName={job.tradieName}
            jobTitle={job.title}
            amount={0}
            onConfirmed={() => setShowPaymentConfirm(false)}
          />
        </div>
      )}
    </DashboardShell>
  );
}
