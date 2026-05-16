export interface TrustInputs {
  avgRating: number;
  totalReviews: number;
  completionRate: number;
  cancellationRate: number;
  responseTimeMinutes: number;
  repeatCustomerRate: number;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  totalJobsCompleted: number;
  emergencyJobRate: number;
  accountAgeDays: number;
}

export interface TrustResult {
  score: number;
  badge: 'NONE' | 'VERIFIED' | 'PREMIUM' | 'ELITE';
  breakdown: Record<string, number>;
  flags: string[];
}

// Weights must sum to 100
const WEIGHTS = {
  rating: 30,
  completion: 20,
  cancellation: 15,
  responseTime: 15,
  repeatCustomers: 10,
  verification: 5,
  experience: 5,
};

export function calculateTrustScore(inputs: TrustInputs): TrustResult {
  const flags: string[] = [];

  // Rating score (0-30)
  const minReviews = Math.min(inputs.totalReviews / 10, 1);
  const ratingScore = (inputs.avgRating / 5) * WEIGHTS.rating * minReviews;

  // Completion rate (0-20)
  const completionScore = (inputs.completionRate / 100) * WEIGHTS.completion;

  // Cancellation penalty (0-15, inverted)
  const cancellationScore = Math.max(0, (1 - inputs.cancellationRate / 100)) * WEIGHTS.cancellation;

  // Response time (0-15)
  const maxResponseMins = 120;
  const responseScore =
    inputs.responseTimeMinutes === 0
      ? 0
      : Math.max(0, (1 - inputs.responseTimeMinutes / maxResponseMins)) * WEIGHTS.responseTime;

  // Repeat customers (0-10)
  const repeatScore = (inputs.repeatCustomerRate / 100) * WEIGHTS.repeatCustomers;

  // Verification (0-5)
  const verificationScore = inputs.verificationStatus === 'VERIFIED' ? WEIGHTS.verification : 0;

  // Experience (0-5) — caps at 5+ years
  const experienceScore = Math.min(inputs.accountAgeDays / (365 * 5), 1) * WEIGHTS.experience;

  const score = Math.round(
    ratingScore +
    completionScore +
    cancellationScore +
    responseScore +
    repeatScore +
    verificationScore +
    experienceScore,
  );

  // Fraud flags
  if (inputs.cancellationRate > 30) flags.push('HIGH_CANCELLATION_RATE');
  if (inputs.avgRating < 2 && inputs.totalReviews > 5) flags.push('LOW_RATING');
  if (inputs.completionRate < 50 && inputs.totalJobsCompleted > 5) flags.push('LOW_COMPLETION_RATE');

  // Badge assignment
  let badge: TrustResult['badge'] = 'NONE';
  if (inputs.verificationStatus === 'VERIFIED') {
    if (score >= 85 && inputs.totalJobsCompleted >= 50) badge = 'ELITE';
    else if (score >= 70 && inputs.totalJobsCompleted >= 20) badge = 'PREMIUM';
    else badge = 'VERIFIED';
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    badge,
    breakdown: {
      rating: ratingScore,
      completion: completionScore,
      cancellation: cancellationScore,
      responseTime: responseScore,
      repeatCustomers: repeatScore,
      verification: verificationScore,
      experience: experienceScore,
    },
    flags,
  };
}
