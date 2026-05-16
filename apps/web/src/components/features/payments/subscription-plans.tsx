'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Zap } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

interface Plan {
  tier: string;
  name: string;
  priceMonthlyAud: number;
  features: string[];
  monthlyBonusCredits: number;
  badgeLabel: string | null;
}

interface SubscriptionPlansProps {
  plans: Plan[];
  currentTier?: string;
  onSelect: (tier: string) => Promise<void>;
}

const PLAN_STYLES: Record<string, { gradient: string; badge: string; ring: string }> = {
  FREE:         { gradient: 'from-gray-50 to-gray-100', badge: 'bg-gray-200 text-gray-700', ring: 'ring-gray-300' },
  BASIC:        { gradient: 'from-amber-50 to-amber-100', badge: 'bg-amber-200 text-amber-800', ring: 'ring-amber-400' },
  PROFESSIONAL: { gradient: 'from-slate-50 to-slate-100', badge: 'bg-slate-200 text-slate-800', ring: 'ring-slate-400' },
  ELITE:        { gradient: 'from-yellow-50 to-amber-100', badge: 'bg-yellow-300 text-yellow-900', ring: 'ring-yellow-500' },
};

export function SubscriptionPlans({ plans, currentTier = 'FREE', onSelect }: SubscriptionPlansProps) {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSelect = async (tier: string) => {
    if (tier === currentTier || loading) return;
    setLoading(tier);
    try {
      await onSelect(tier);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan, idx) => {
        const styles = PLAN_STYLES[plan.tier] ?? PLAN_STYLES.FREE!;
        const isCurrent = plan.tier === currentTier;
        const isElite = plan.tier === 'ELITE';

        return (
          <motion.div
            key={plan.tier}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={cn(
              'relative flex flex-col rounded-3xl border-2 bg-gradient-to-br p-5',
              styles.gradient,
              isCurrent ? `${styles.ring} ring-2` : 'border-transparent hover:border-gray-200',
              isElite && 'shadow-lg'
            )}
          >
            {isCurrent && (
              <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                Current
              </span>
            )}

            {plan.badgeLabel && (
              <span className={cn('mb-3 w-fit rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider', styles.badge)}>
                {plan.badgeLabel}
              </span>
            )}

            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>

            <div className="my-3">
              {plan.priceMonthlyAud === 0 ? (
                <p className="text-3xl font-black text-gray-900">Free</p>
              ) : (
                <>
                  <p className="text-3xl font-black text-gray-900">${plan.priceMonthlyAud}</p>
                  <p className="text-xs text-gray-500">AUD / month</p>
                </>
              )}
            </div>

            {plan.monthlyBonusCredits > 0 && (
              <div className="mb-3 flex items-center gap-1.5 rounded-xl bg-white/60 px-3 py-2">
                <Zap size={13} className="text-brand-600" />
                <p className="text-xs font-medium text-brand-700">+{plan.monthlyBonusCredits} credits/month</p>
              </div>
            )}

            <ul className="mb-5 flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check size={14} className="mt-0.5 shrink-0 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan.tier)}
              disabled={isCurrent || loading !== null}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition-all',
                isCurrent
                  ? 'bg-gray-200 text-gray-500 cursor-default'
                  : isElite
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-brand-600 text-white hover:bg-brand-700',
                loading !== null && !isCurrent && 'opacity-60'
              )}
            >
              {loading === plan.tier ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isCurrent ? (
                'Your plan'
              ) : plan.priceMonthlyAud === 0 ? (
                'Downgrade'
              ) : (
                `Upgrade to ${plan.name}`
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
