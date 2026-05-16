'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Loader2, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { toast } from 'sonner';

interface PaymentConfirmationProps {
  jobId: string;
  tradieName: string;
  jobTitle: string;
  amount: number;
  onConfirmed: () => void;
}

export function PaymentConfirmation({ jobId, tradieName, jobTitle, amount, onConfirmed }: PaymentConfirmationProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [step, setStep] = useState<'confirm' | 'releasing' | 'done'>('confirm');
  const [showWarning, setShowWarning] = useState(false);

  async function releasePayment() {
    if (rating === 0) {
      setShowWarning(true);
      return;
    }
    setStep('releasing');
    try {
      const res = await fetch('/api/payments/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error('Payment release failed');
      setStep('done');
      setTimeout(onConfirmed, 1200);
    } catch {
      toast.error('Failed to release payment. Please try again or contact support.');
      setStep('confirm');
    }
  }

  if (step === 'releasing') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-12 text-center shadow-lg">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="mt-4 font-semibold text-gray-700">Releasing payment to {tradieName}…</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border bg-white p-12 text-center shadow-lg"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <CheckCircle2 size={56} className="text-green-500" />
        </motion.div>
        <p className="mt-4 text-xl font-bold text-gray-900">Payment Released!</p>
        <p className="mt-2 text-sm text-gray-500">
          ${amount.toFixed(2)} has been sent to {tradieName}. Thanks for using Fixit247!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-lg">
      {/* Header */}
      <div className="rounded-t-2xl bg-green-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <DollarSign size={20} className="text-white" />
          <div>
            <p className="font-semibold text-white">Confirm Job Completion</p>
            <p className="text-xs text-green-100">Release payment to your tradie</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Job summary */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{jobTitle}</p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            ${amount.toFixed(2)} → {tradieName}
          </p>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-gray-700">Rate {tradieName}'s work</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => { setRating(s); setShowWarning(false); }}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                className="text-3xl transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  size={32}
                  fill={s <= (hovered || rating) ? '#FBBF24' : 'none'}
                  stroke={s <= (hovered || rating) ? '#FBBF24' : '#D1D5DB'}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
            </p>
          )}
          {showWarning && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600">
              <AlertTriangle size={12} />
              Please rate {tradieName}'s work before releasing payment
            </div>
          )}
        </div>

        <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700 mb-4">
          <p className="font-medium">Are you satisfied with the completed work?</p>
          <p className="mt-0.5">Once released, payment cannot be reversed. If there's an issue, contact support first.</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 text-gray-600"
            onClick={() => toast.info('Contact support via the help centre for disputes.')}
          >
            Dispute
          </Button>
          <Button
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
            onClick={releasePayment}
          >
            <CheckCircle2 size={16} />
            Confirm & Release ${amount.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
