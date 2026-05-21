'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, X } from 'lucide-react';
import { TradieJobCard } from './tradie-job-card';
import { useSocketEvent } from '@/hooks/use-socket';

interface JobOffer {
  jobId: string;
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
    createdAt: string;
    address?: { suburb: string; state: string } | null;
    aiInsight?: { urgencyScore: number; confidenceScore: number } | null;
  };
  expiresAt: string;
  secondsRemaining: number;
}

export function LiveDispatchPanel() {
  const [offers, setOffers] = React.useState<JobOffer[]>([]);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  // Listen for new job offers via WebSocket
  useSocketEvent('job:new_offer', React.useCallback((payload) => {
    const expiresAt = new Date(payload.expiresAt);
    const secondsRemaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

    setOffers((prev) => {
      if (prev.find((o) => o.jobId === payload.jobId)) return prev;
      return [...prev, { jobId: payload.jobId, job: payload.job as JobOffer['job'], expiresAt: payload.expiresAt, secondsRemaining }];
    });
  }, []));

  useSocketEvent('job:offer_expired', React.useCallback((payload) => {
    setOffers((prev) => prev.filter((o) => o.jobId !== payload.jobId));
  }, []));

  // Countdown timers
  React.useEffect(() => {
    const interval = setInterval(() => {
      setOffers((prev) =>
        prev
          .map((o) => ({ ...o, secondsRemaining: Math.max(0, Math.floor((new Date(o.expiresAt).getTime() - Date.now()) / 1000)) }))
          .filter((o) => o.secondsRemaining > 0)
      );
    }, 1000);
    return () => { clearInterval(interval); };
  }, []);

  const handleAccept = async (jobId: string) => {
    setProcessingId(jobId);
    try {
      const offer = offers.find((o) => o.jobId === jobId);
      const quotedPrice = offer?.job.budgetMax ?? offer?.job.budgetMin ?? 200;

      const res = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotedPrice }),
      });

      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o.jobId !== jobId));
        window.location.href = `/tradie/jobs/${jobId}`;
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (jobId: string) => {
    setProcessingId(jobId);
    try {
      await fetch(`/api/jobs/${jobId}/decline`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'Not available' }) });
      setOffers((prev) => prev.filter((o) => o.jobId !== jobId));
    } finally {
      setProcessingId(null);
    }
  };

  if (offers.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 lg:bottom-6 lg:right-6 lg:left-auto lg:w-96">
      <AnimatePresence>
        {offers.map((offer) => (
          <motion.div
            key={offer.jobId}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="mb-3 overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Notification header */}
            <div className={`flex items-center gap-2 px-4 py-2.5 ${offer.job.isEmergency ? 'bg-red-600' : 'bg-brand-600'}`}>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                {offer.job.isEmergency ? <Zap size={12} className="text-white" /> : <Bell size={12} className="text-white" />}
              </div>
              <p className="flex-1 text-sm font-semibold text-white">New job offer!</p>
              {/* Countdown */}
              <div className={`rounded-lg px-2 py-0.5 text-xs font-bold ${offer.secondsRemaining < 60 ? 'bg-white/30 text-white animate-pulse' : 'bg-white/20 text-white'}`}>
                {Math.floor(offer.secondsRemaining / 60)}:{String(offer.secondsRemaining % 60).padStart(2, '0')}
              </div>
              <button
                onClick={() => { setOffers((prev) => prev.filter((o) => o.jobId !== offer.jobId)); }}
                className="rounded-lg p-0.5 text-white/70 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Job card */}
            <TradieJobCard
              job={offer.job}
              mode="offer"
              onAccept={handleAccept}
              onDecline={handleDecline}
              isProcessing={processingId === offer.jobId}
            />

            {/* Timer bar */}
            <motion.div
              className={`h-1 ${offer.job.isEmergency ? 'bg-red-500' : 'bg-brand-500'}`}
              animate={{ width: `${(offer.secondsRemaining / 600) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
              style={{ width: '100%' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
