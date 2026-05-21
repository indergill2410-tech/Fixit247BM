'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, CheckCircle2, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { toast } from 'sonner';

interface CheckoutPanelProps {
  jobId: string;
  jobTitle: string;
  tradieName: string;
  tradieRating: number;
  estimatedAmount: number;
  platformFeePercent?: number;
  isEmergency?: boolean;
  surgeFactor?: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

type Step = 'review' | 'payment' | 'processing' | 'success';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </div>
  );
}

export function CheckoutPanel({
  jobId,
  jobTitle,
  tradieName,
  tradieRating,
  estimatedAmount,
  platformFeePercent = 15,
  isEmergency = false,
  surgeFactor = 1,
  onSuccess,
  onCancel,
}: CheckoutPanelProps) {
  const [step, setStep] = useState<Step>('review');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const platformFee = Math.round(estimatedAmount * (platformFeePercent / 100));
  const tradieReceives = estimatedAmount - platformFee;
  const surgeExtra = surgeFactor > 1 ? Math.round(estimatedAmount * (surgeFactor - 1)) : 0;
  const totalCharge = estimatedAmount + (isEmergency ? surgeExtra : 0);

  async function createIntent() {
    setStep('processing');
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to create payment');
      }
      const { clientSecret: secret } = await res.json();
      setClientSecret(secret);
      setStep('payment');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
      setStep('review');
    }
  }

  async function confirmPayment() {
    setStep('processing');
    try {
      // In production: use Stripe.js stripe.confirmPayment() with clientSecret
      // Simulating success for the UI scaffold
      await new Promise((r) => setTimeout(r, 1500));
      setStep('success');
      setTimeout(() => { onSuccess(clientSecret ?? ''); }, 800);
    } catch {
      toast.error('Payment confirmation failed');
      setStep('payment');
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white shadow-lg">
      {/* Header */}
      <div className={`px-6 py-4 ${isEmergency ? 'bg-red-600' : 'bg-gray-900'}`}>
        <div className="flex items-center gap-3">
          <Lock size={18} className="text-white/80" />
          <div>
            <p className="text-sm font-semibold text-white">Secure Payment — Funds held in escrow</p>
            <p className="text-xs text-white/60">Released to tradie only after you confirm job completion</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-6"
          >
            {/* Job summary */}
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Job</p>
              <p className="mt-1 font-semibold text-gray-900">{jobTitle}</p>
            </div>

            {/* Tradie */}
            <div className="mb-6 flex items-center gap-3 rounded-xl border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold">
                {tradieName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{tradieName}</p>
                <StarRating rating={tradieRating} />
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <Shield size={12} />
                Verified
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="mb-6 space-y-2 rounded-xl border p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Price Breakdown</p>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Job estimate</span>
                <span className="font-medium">${estimatedAmount.toFixed(2)}</span>
              </div>

              {isEmergency && surgeFactor > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600">Emergency surge ({surgeFactor}×)</span>
                  <span className="font-medium text-orange-600">+${surgeExtra.toFixed(2)}</span>
                </div>
              )}

              <div className="my-2 border-t" />

              <div className="flex justify-between text-base font-bold">
                <span>Total (held in escrow)</span>
                <span>${totalCharge.toFixed(2)}</span>
              </div>

              <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                <p className="font-medium">How escrow works:</p>
                <p>Your payment is held securely. The tradie receives ${tradieReceives.toFixed(2)} only after you mark the job complete. Platform fee: ${platformFee.toFixed(2)}.</p>
              </div>
            </div>

            {isEmergency && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <p>This is an emergency dispatch. A ${15} dispatch fee and surge pricing apply.</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button onClick={createIntent} className="flex-1 gap-2">
                <CreditCard size={16} />
                Proceed to Pay ${totalCharge.toFixed(2)}
                <ChevronRight size={14} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-6"
          >
            <div className="mb-6 rounded-xl border p-4">
              <p className="mb-4 text-sm font-semibold text-gray-700">Payment Details</p>

              {/* Stripe Elements would mount here in production */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Card number</label>
                  <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2.5">
                    <CreditCard size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">•••• •••• •••• ••••</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Expiry</label>
                    <div className="rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-400">MM / YY</div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">CVC</label>
                    <div className="rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-400">•••</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
              <Lock size={12} />
              Secured by Stripe · PCI DSS compliant
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setStep('review'); }} className="flex-1">
                Back
              </Button>
              <Button onClick={confirmPayment} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                <Lock size={14} />
                Pay ${totalCharge.toFixed(2)} Securely
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Loader2 size={40} className="animate-spin text-brand-500" />
            <p className="mt-4 font-semibold text-gray-700">Processing payment…</p>
            <p className="mt-1 text-sm text-gray-400">Please don't close this window</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              <CheckCircle2 size={56} className="text-green-500" />
            </motion.div>
            <p className="mt-4 text-xl font-bold text-gray-900">Payment Received</p>
            <p className="mt-2 text-sm text-gray-500">
              ${totalCharge.toFixed(2)} is held securely in escrow.<br />
              Release it to {tradieName} when the job is complete.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
