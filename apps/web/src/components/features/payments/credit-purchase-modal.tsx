'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Star, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

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

export function CreditPurchaseModal({ open, onClose, packages }: CreditPurchaseModalProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<'select' | 'confirm' | 'success'>('select');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const selectedPkg = packages.find((p) => p.id === selected);

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setIsProcessing(true);
    try {
      // In production: collect payment method first, then POST to /api/credits/purchase
      // For now simulate success
      await new Promise((r) => setTimeout(r, 1500));
      setStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    if (!open) { setStep('select'); setSelected(null); }
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
                          onClick={() => setSelected(pkg.id)}
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
                              <span>{Math.round((pkg.bonusCredits / pkg.credits) * 100)}% bonus credits included</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => selected && setStep('confirm')}
                    disabled={!selected}
                    className={cn(
                      'mt-5 w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition-all',
                      selected ? 'bg-brand-600 hover:bg-brand-700' : 'bg-gray-200 cursor-not-allowed text-gray-400'
                    )}
                  >
                    Continue
                  </button>
                </>
              )}

              {step === 'confirm' && selectedPkg && (
                <div>
                  <div className="mb-5 rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500 mb-1">You're purchasing</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedPkg.credits + selectedPkg.bonusCredits} credits
                    </p>
                    <p className="text-sm text-gray-500">{selectedPkg.name}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-gray-900">${Number(selectedPkg.priceAud).toFixed(2)} AUD</span>
                    </div>
                  </div>

                  <p className="mb-4 text-xs text-gray-400">
                    Payment will be charged to your saved payment method. Credits are non-refundable once used.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('select')}
                      className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                      {isProcessing ? 'Processing…' : 'Pay now'}
                    </button>
                  </div>
                </div>
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
