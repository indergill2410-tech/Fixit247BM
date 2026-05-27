'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShoppingCart } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

interface WalletCardProps {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  subscriptionTier?: string;
  onPurchaseClick: () => void;
  className?: string;
}

const TIER_COLORS: Record<string, string> = {
  FREE: 'from-gray-700 to-gray-900',
  BASIC: 'from-amber-700 to-amber-900',
  PROFESSIONAL: 'from-slate-600 to-slate-800',
  ELITE: 'from-yellow-600 to-amber-700',
};

const TIER_LABELS: Record<string, string> = {
  FREE: 'Free',
  BASIC: 'Bronze',
  PROFESSIONAL: 'Silver',
  ELITE: 'Gold',
};

export function WalletCard({ balance, lifetimeEarned, lifetimeSpent, subscriptionTier = 'FREE', onPurchaseClick, className }: WalletCardProps) {
  const gradient = TIER_COLORS[subscriptionTier] ?? TIER_COLORS.FREE;
  const tierLabel = TIER_LABELS[subscriptionTier] ?? 'Free';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(`rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`, className)}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest">Credit Balance</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-5xl font-black">{balance}</p>
            <p className="mb-1.5 text-lg text-white/70">credits</p>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Zap size={22} className="text-white" />
        </div>
      </div>

      <div className="mb-5 flex gap-3">
        <div className="flex-1 rounded-2xl bg-white/10 p-3">
          <p className="text-xs text-white/60">Earned</p>
          <p className="text-lg font-bold">{lifetimeEarned}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white/10 p-3">
          <p className="text-xs text-white/60">Used</p>
          <p className="text-lg font-bold">{lifetimeSpent}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white/10 p-3">
          <p className="text-xs text-white/60">Plan</p>
          <p className="text-lg font-bold">{tierLabel}</p>
        </div>
      </div>

      <button
        onClick={onPurchaseClick}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/20 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-all active:scale-95"
      >
        <ShoppingCart size={16} />
        Buy credits
      </button>
    </motion.div>
  );
}
