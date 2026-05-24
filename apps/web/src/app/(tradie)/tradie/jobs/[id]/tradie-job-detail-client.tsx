'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Navigation, CheckCircle2, Loader2, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { ChatWindow } from '@/components/features/chat/chat-window';
import { TradieNavigationPanel } from '@/components/features/tracking/tradie-navigation-panel';
import { useJobSubscription, useRealTimeJobStatus } from '@/lib/socket/hooks';

interface Props {
  job: {
    id: string; title: string; status: string; isEmergency: boolean; priority: string;
    description: string; address: string; suburb: string;
    latitude: number | null; longitude: number | null;
    customerId: string; customerName: string; createdAt: string;
  };
  currentUser: { id: string; tradieProfileId: string };
}

const STATUS_ACTIONS: Record<string, { label: string; next: string; color: string } | null> = {
  CLAIMED:     { label: "I'm On My Way", next: 'EN_ROUTE', color: 'bg-brand-500 hover:bg-brand-400' },
  EN_ROUTE:    { label: "I've Arrived", next: 'ARRIVED', color: 'bg-green-600 hover:bg-green-700' },
  ARRIVED:     { label: 'Start Job', next: 'IN_PROGRESS', color: 'bg-brand-600 hover:bg-brand-700' },
  IN_PROGRESS: { label: 'Mark Job Complete', next: 'COMPLETED', color: 'bg-green-600 hover:bg-green-700' },
  COMPLETED:   null,
  CANCELLED:   null,
};

export function TradieJobDetailClient({ job, currentUser }: Props) {
  const [activeTab, setActiveTab] = useState<'nav' | 'chat'>('nav');
  const [updating, setUpdating] = useState(false);

  useJobSubscription(job.id);
  const { status } = useRealTimeJobStatus(job.id, job.status);
  const action = STATUS_ACTIONS[status] ?? null;

  async function updateStatus() {
    if (!action) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action.next }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(action.next === 'COMPLETED' ? '🎉 Job marked as complete!' : 'Status updated!');
    } catch {
      toast.error('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <DashboardShell role="TRADIE">
      {/* Header */}
      <div className={`mb-6 rounded-2xl p-6 ${job.isEmergency ? 'bg-red-900 text-white' : 'bg-gray-900 text-white'}`}>
        {job.isEmergency && (
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-300">Emergency Job</span>
          </div>
        )}
        <h1 className="text-xl font-bold">{job.title}</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-white/60">
          <span className="flex items-center gap-1"><MapPin size={12} />{job.suburb}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{new Date(job.createdAt).toLocaleDateString('en-AU')}</span>
        </div>
        <div className="mt-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/80'
          }`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Job description */}
      {job.description && (
        <div className="mb-4 rounded-xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Job Details</p>
          <p className="text-sm text-gray-400">{job.description}</p>
        </div>
      )}

      {/* Status action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={updateStatus}
            disabled={updating}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98] ${action.color} disabled:opacity-70`}
          >
            {updating
              ? <><Loader2 size={20} className="animate-spin" /> Updating…</>
              : <><CheckCircle2 size={20} /> {action.label}</>
            }
          </button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-2 rounded-xl bg-white/6 p-1">
        {[
          { key: 'nav', label: 'Navigation', icon: Navigation },
          { key: 'chat', label: 'Chat', icon: MessageCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key as 'nav' | 'chat'); }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              activeTab === key ? 'bg-brand-500/15 text-brand-400' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="h-80">
        {activeTab === 'nav' && (
          <TradieNavigationPanel
            jobId={job.id}
            jobAddress={job.address}
            jobLatitude={job.latitude}
            jobLongitude={job.longitude}
          />
        )}
        {activeTab === 'chat' && (
          <ChatWindow
            jobId={job.id}
            currentUserId={currentUser.id}
            currentUserName="You"
            participantName={job.customerName}
          />
        )}
      </div>
    </DashboardShell>
  );
}
