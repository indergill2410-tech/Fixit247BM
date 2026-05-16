import { db } from '@fixit247/database';

export interface TrustInputs {
  tradieId: string;
  avgRating: number;           // 0-5
  completionRate: number;      // 0-1
  cancellationRate: number;    // 0-1
  avgResponseTimeMinutes: number;
  totalJobs: number;
  repeatCustomerRate: number;  // 0-1
  emergencyCompletionRate: number; // 0-1
  disputeRate: number;         // 0-1
  refundRate: number;          // 0-1
  verificationLevel: 'NONE' | 'BASIC' | 'VERIFIED' | 'PREMIUM';
  daysSinceLastJob: number;
}

export interface TrustScoreResult {
  score: number;
  breakdown: {
    rating: number;
    completion: number;
    cancellation: number;
    responseTime: number;
    repeatCustomers: number;
    emergencyPerformance: number;
    disputeHistory: number;
    verificationBonus: number;
    inactivityPenalty: number;
  };
  badge: TradieBadge[];
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export type TradieBadge =
  | 'VERIFIED'
  | 'PREMIUM'
  | 'ELITE'
  | 'EMERGENCY_SPECIALIST'
  | 'TOP_RATED'
  | 'FAST_RESPONSE';

const WEIGHTS = {
  rating: 0.25,
  completion: 0.20,
  cancellation: 0.15,
  responseTime: 0.15,
  repeatCustomers: 0.10,
  emergencyPerformance: 0.10,
  disputeHistory: 0.05,
};

export function calculateTrustScore(inputs: TrustInputs): TrustScoreResult {
  // Each component scored 0–100 before weighting
  const rating = (inputs.avgRating / 5) * 100;

  const completion = inputs.completionRate * 100;

  const cancellation = Math.max(0, 100 - inputs.cancellationRate * 300); // >33% → 0

  const responseTime = inputs.avgResponseTimeMinutes <= 2 ? 100
    : inputs.avgResponseTimeMinutes <= 5 ? 90
    : inputs.avgResponseTimeMinutes <= 10 ? 75
    : inputs.avgResponseTimeMinutes <= 20 ? 55
    : inputs.avgResponseTimeMinutes <= 60 ? 30
    : 10;

  const repeatCustomers = inputs.repeatCustomerRate * 100;

  const emergencyPerformance = inputs.emergencyCompletionRate * 100;

  const disputeHistory = Math.max(0, 100 - inputs.disputeRate * 500); // >20% → 0

  // Verification bonus (flat add after weighting)
  const verificationBonus =
    inputs.verificationLevel === 'PREMIUM' ? 8
    : inputs.verificationLevel === 'VERIFIED' ? 5
    : inputs.verificationLevel === 'BASIC' ? 2
    : 0;

  // Inactivity decay: -1 point per day after 30 days, max -20
  const inactivityPenalty = inputs.daysSinceLastJob > 30
    ? Math.min(20, (inputs.daysSinceLastJob - 30) * 1)
    : 0;

  const rawScore =
    rating * WEIGHTS.rating +
    completion * WEIGHTS.completion +
    cancellation * WEIGHTS.cancellation +
    responseTime * WEIGHTS.responseTime +
    repeatCustomers * WEIGHTS.repeatCustomers +
    emergencyPerformance * WEIGHTS.emergencyPerformance +
    disputeHistory * WEIGHTS.disputeHistory;

  const score = Math.round(
    Math.min(100, Math.max(0, rawScore + verificationBonus - inactivityPenalty))
  );

  const badges = assignBadges(inputs, score);
  const tier = score >= 90 ? 'PLATINUM' : score >= 75 ? 'GOLD' : score >= 55 ? 'SILVER' : 'BRONZE';

  return {
    score,
    breakdown: {
      rating: Math.round(rating * WEIGHTS.rating),
      completion: Math.round(completion * WEIGHTS.completion),
      cancellation: Math.round(cancellation * WEIGHTS.cancellation),
      responseTime: Math.round(responseTime * WEIGHTS.responseTime),
      repeatCustomers: Math.round(repeatCustomers * WEIGHTS.repeatCustomers),
      emergencyPerformance: Math.round(emergencyPerformance * WEIGHTS.emergencyPerformance),
      disputeHistory: Math.round(disputeHistory * WEIGHTS.disputeHistory),
      verificationBonus,
      inactivityPenalty: -inactivityPenalty,
    },
    badge: badges,
    tier,
  };
}

function assignBadges(inputs: TrustInputs, score: number): TradieBadge[] {
  const badges: TradieBadge[] = [];
  if (['VERIFIED', 'PREMIUM'].includes(inputs.verificationLevel)) badges.push('VERIFIED');
  if (inputs.verificationLevel === 'PREMIUM') badges.push('PREMIUM');
  if (score >= 90 && inputs.totalJobs >= 50) badges.push('ELITE');
  if (inputs.emergencyCompletionRate >= 0.9 && inputs.totalJobs >= 20) badges.push('EMERGENCY_SPECIALIST');
  if (inputs.avgRating >= 4.8 && inputs.totalJobs >= 20) badges.push('TOP_RATED');
  if (inputs.avgResponseTimeMinutes <= 3) badges.push('FAST_RESPONSE');
  return badges;
}
