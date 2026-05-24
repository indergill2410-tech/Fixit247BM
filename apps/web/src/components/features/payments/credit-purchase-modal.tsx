'use client';

import * as React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@fixit247/ui/src/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceAud: number | string;
  bonusCredits: number;
  isPopular: boolean;
}

interface CreditPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  packages: CreditPackage[];
}

interface StripePayStepProps {
  selectedPkg: CreditPackage;
  onSuccess: () => void;
  onBack: () => void;
}

function StripePayStep({ selectedPkg, onSuccess, onBack }: StripePayStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/tradie/wallet`,
        },
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message ?? 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }
      if (paymentIntent?.status === 'succeeded') {
        const res = await fetch('/api/credits/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
        if (!res.ok) {
          toast.error('Payment succeeded but credits could not be added. Contact support.');
        }
        onSuccess();
      }
    } catch {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-gray-50 p-4">
        <p className="text-xs text-gray-500 mb-1">Paying for</p>
        <p className="text-lg font-bold text-gray-900">
          {selectedPkg.credits + selectedPkg.bonusCredits} credits — ${Number(selectedPkg.priceAud).toFixed(2)} AUD
        </p>
      </div>
      <div className="mb-5">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <p className="mb-4 text-xs text-gray-400">
        Credits are non-refundable once used.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={isProcessing || !stripe}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          {isProcessing ? 'Processing…' : `Pay $${Number(selectedPkg.priceAud).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

export function CreditPurchaseModal({ open, onClose, packages }: CreditPurchaseModalProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<'select' | 'payment' | 'success'>('select');
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = React.useState(false);

  const selectedPkg = packages.find((p) => p.id === selected);

  async function handleContinue() {
    if (!selectedPkg) return;
    setIsCreatingIntent(true);
    try {
      const res = await fetch('/api/credits/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPkg.id }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Failed to start checkout');
      }
      const { clientSecret: secret } = await res.json() as { clientSecret: string };
      setClientSecret(secret);
      setStep('payment');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setIsCreatingIntent(false);
    }
  }

  React.useEffect(() => {
    if (!open) {
      setStep('select');
      setSelected(null);
      setClientSecret(null);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-xl font-bold text-gray-900">Buy Credits</h2>
              <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {step === 'select' && (
                <>
                  <p className="mb-4 text-sm text-gray-500">Choose a credit bundle. Credits are used to claim jobs.</p>
                  <div className="space-y-3">
                    {packages.map((pkg) => {
                      const total = pkg.credits + pkg.bonusCredits;
                      const isSelected = selected === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => { setSelected(pkg.id); }}
                          className={cn(
                            'relative w-full rounded-2xl border-2 p-4 text-left transition-all',
                            isSelected ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white hover:border-brand-300'
                          )}
                        >
                          {pkg.isPopular && (
                            <span className="absolute right-3 top-3 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                              Popular
                            </span>
                          )}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{pkg.name}</p>
                              <p className="text-sm text-gray-500">
                                {pkg.credits} credits
                                {pkg.bonusCredits > 0 && (
                                  <span className="ml-1.5 text-green-600 font-medium">+{pkg.bonusCredits} bonus</span>
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">${Number(pkg.priceAud).toFixed(0)}</p>
                              <p className="text-xs text-gray-400">AUD</p>
                            </div>
                          </div>
                          {pkg.bonusCredits > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                              <Star size={11} />
                              <span>{Math.round((pkg.bonusCredits / pkg.credits) * 100)}% bonus credits included · {total} total</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={!selected || isCreatingIntent}
                    className={cn(
                      'mt-5 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all',
                      selected && !isCreatingIntent ? 'bg-brand-600 hover:bg-brand-700' : 'bg-gray-200 cursor-not-allowed text-gray-400'
                    )}
                  >
                    {isCreatingIntent && <Loader2 size={16} className="animate-spin" />}
                    {isCreatingIntent ? 'Preparing…' : 'Continue to Payment'}
                  </button>
                </>
              )}

              {step === 'payment' && clientSecret && selectedPkg && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: 'stripe' } }}
                >
                  <StripePayStep
                    selectedPkg={selectedPkg}
                    onSuccess={() => { setStep('success'); }}
                    onBack={() => { setStep('select'); setClientSecret(null); }}
                  />
                </Elements>
              )}

              {step === 'success' && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900">Credits added!</h3>
                  <p className="text-sm text-gray-500">
                    {selectedPkg && `${selectedPkg.credits + selectedPkg.bonusCredits} credits have been added to your wallet.`}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
