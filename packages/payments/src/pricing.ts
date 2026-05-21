import { PLATFORM_FEE_PERCENT } from './stripe';

export type JobComplexity = 'SIMPLE' | 'MEDIUM' | 'COMPLEX';
export type JobPriority = 'STANDARD' | 'URGENT' | 'EMERGENCY';

export interface DynamicPriceResult {
  baseAmount: number;
  surgeMultiplier: number;
  surgeFactor: string;
  platformFeePercent: number;
  platformFee: number;
  tradieAmount: number;
  creditCost: number;
  emergencyDispatchFee: number;
  totalCustomerPayment: number;
  breakdown: Record<string, number>;
}

// Credit costs per job type (deducted from tradie wallet on accept)
export const CREDIT_COSTS: Record<JobComplexity, Record<JobPriority, number>> = {
  SIMPLE:  { STANDARD: 1, URGENT: 2,  EMERGENCY: 4  },
  MEDIUM:  { STANDARD: 3, URGENT: 5,  EMERGENCY: 8  },
  COMPLEX: { STANDARD: 5, URGENT: 8,  EMERGENCY: 12 },
};

// Subscription tier discounts on credit costs
export const SUBSCRIPTION_CREDIT_DISCOUNTS: Record<string, number> = {
  FREE:         0,
  BASIC:        0.10, // 10% discount
  PROFESSIONAL: 0.20, // 20% discount
  ELITE:        0.35, // 35% discount
};

// Emergency dispatch platform fee premium (added on top of base fee)
export const EMERGENCY_DISPATCH_FEE_AUD = 15;

export function calculateCreditCost(
  complexity: JobComplexity,
  priority: JobPriority,
  subscriptionTier = 'FREE'
): number {
  const base = CREDIT_COSTS[complexity][priority];
  const discount = SUBSCRIPTION_CREDIT_DISCOUNTS[subscriptionTier] ?? 0;
  return Math.max(1, Math.ceil(base * (1 - discount)));
}

export function calculateSurgeMultiplier(
  priority: JobPriority,
  hourOfDay: number,
  dayOfWeek: number // 0=Sun
): { multiplier: number; factor: string } {
  if (priority !== 'EMERGENCY') return { multiplier: 1.0, factor: 'NONE' };

  // Weekend nights / public holiday periods
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isAfterHours = hourOfDay < 7 || hourOfDay >= 22;
  const isPeakEvening = hourOfDay >= 17 && hourOfDay < 20;

  if (isAfterHours && isWeekend) return { multiplier: 2.0, factor: 'CRITICAL' };
  if (isAfterHours) return { multiplier: 1.75, factor: 'HIGH' };
  if (isWeekend) return { multiplier: 1.40, factor: 'MEDIUM' };
  if (isPeakEvening) return { multiplier: 1.20, factor: 'LOW' };

  return { multiplier: 1.0, factor: 'NONE' };
}

export function calculateJobPricing(opts: {
  baseAmount: number;
  complexity: JobComplexity;
  priority: JobPriority;
  subscriptionTier?: string;
  customPlatformFeePercent?: number;
}): DynamicPriceResult {
  const now = new Date();
  const hourOfDay = now.getHours();
  const dayOfWeek = now.getDay();

  const { multiplier, factor } = calculateSurgeMultiplier(opts.priority, hourOfDay, dayOfWeek);
  const surgedAmount = Math.round(opts.baseAmount * multiplier * 100) / 100;

  const feePercent = opts.customPlatformFeePercent ?? PLATFORM_FEE_PERCENT;
  const platformFee = Math.round(surgedAmount * feePercent * 100) / 100;
  const emergencyDispatchFee = opts.priority === 'EMERGENCY' ? EMERGENCY_DISPATCH_FEE_AUD : 0;
  const tradieAmount = surgedAmount - platformFee;
  const totalCustomerPayment = surgedAmount + emergencyDispatchFee;

  const creditCost = calculateCreditCost(
    opts.complexity,
    opts.priority,
    opts.subscriptionTier ?? 'FREE'
  );

  return {
    baseAmount: opts.baseAmount,
    surgeMultiplier: multiplier,
    surgeFactor: factor,
    platformFeePercent: feePercent,
    platformFee,
    tradieAmount,
    creditCost,
    emergencyDispatchFee,
    totalCustomerPayment,
    breakdown: {
      jobAmount: surgedAmount,
      emergencyFee: emergencyDispatchFee,
      platformFee,
      tradieNet: tradieAmount,
    },
  };
}
