import type { TradieCandidate, JobRequirements, MatchScoreBreakdown } from './types';

const WEIGHTS = {
  distance: 0.30,
  trust: 0.25,
  response: 0.15,
  availability: 0.10,
  rating: 0.10,
  specialization: 0.10,
} as const;

export function calculateMatchScore(
  tradie: TradieCandidate,
  job: JobRequirements,
  distanceKm: number
): MatchScoreBreakdown {
  const distanceScore = scoreDistance(distanceKm, tradie.serviceRadiusKm, job.isEmergency) * 100 * WEIGHTS.distance;
  const trustScoreVal = (tradie.trustScore / 100) * 100 * WEIGHTS.trust;
  const responseScore = scoreResponseTime(tradie.responseTimeMinutes, job.isEmergency) * 100 * WEIGHTS.response;
  const availabilityScore = scoreAvailability(tradie) * 100 * WEIGHTS.availability;
  const ratingScore = scoreRating(tradie.avgRating, tradie.totalReviews) * 100 * WEIGHTS.rating;
  const specializationScore = scoreSpecialization(tradie.trades, job.category) * 100 * WEIGHTS.specialization;

  const totalScore =
    distanceScore + trustScoreVal + responseScore + availabilityScore + ratingScore + specializationScore;

  return {
    distanceScore: Math.round(distanceScore * 10) / 10,
    trustScore: Math.round(trustScoreVal * 10) / 10,
    responseScore: Math.round(responseScore * 10) / 10,
    availabilityScore: Math.round(availabilityScore * 10) / 10,
    ratingScore: Math.round(ratingScore * 10) / 10,
    specializationScore: Math.round(specializationScore * 10) / 10,
    totalScore: Math.round(totalScore * 10) / 10,
    distanceKm: Math.round(distanceKm * 10) / 10,
  };
}

function scoreDistance(distanceKm: number, serviceRadiusKm: number, isEmergency: boolean): number {
  const maxRadius = isEmergency ? Math.max(serviceRadiusKm, 50) : serviceRadiusKm;
  if (distanceKm > maxRadius) return 0;
  // Exponential decay — closer is much better
  const ratio = distanceKm / maxRadius;
  return Math.max(0, 1 - Math.pow(ratio, 0.7));
}

function scoreResponseTime(responseTimeMinutes: number, isEmergency: boolean): number {
  if (!responseTimeMinutes || responseTimeMinutes <= 0) return 0.5;
  // Emergency: <15min = perfect, >60min = poor
  // Standard: <60min = perfect, >240min = poor
  const benchmark = isEmergency ? 15 : 60;
  const poor = isEmergency ? 60 : 240;
  if (responseTimeMinutes <= benchmark) return 1.0;
  if (responseTimeMinutes >= poor) return 0.0;
  return 1 - (responseTimeMinutes - benchmark) / (poor - benchmark);
}

function scoreAvailability(tradie: TradieCandidate): number {
  if (tradie.onlineStatus === 'OFFLINE') return 0;
  if (tradie.onlineStatus === 'BUSY') return 0.3;
  if (tradie.activeJobCount === 0) return 1.0;
  if (tradie.activeJobCount === 1) return 0.7;
  if (tradie.activeJobCount === 2) return 0.4;
  return 0.1;
}

function scoreRating(avgRating: number, totalReviews: number): number {
  if (totalReviews === 0) return 0.6; // Neutral for new tradies — give them a chance
  const reviewConfidence = Math.min(1, totalReviews / 20); // Full confidence at 20+ reviews
  const ratingNormalized = (avgRating - 1) / 4; // 1-5 → 0-1
  return ratingNormalized * reviewConfidence + 0.6 * (1 - reviewConfidence);
}

function scoreSpecialization(trades: string[], jobCategory: string): number {
  if (trades.includes(jobCategory)) return 1.0;
  // Partial credit for related trades
  const relatedGroups: Record<string, string[]> = {
    PLUMBING: ['HVAC', 'GENERAL_MAINTENANCE'],
    ELECTRICAL: ['APPLIANCE_REPAIR', 'GENERAL_MAINTENANCE'],
    HVAC: ['PLUMBING', 'ELECTRICAL'],
    CARPENTRY: ['GENERAL_MAINTENANCE', 'ROOFING', 'PLASTERING'],
    PAINTING: ['PLASTERING', 'GENERAL_MAINTENANCE'],
    ROOFING: ['CARPENTRY', 'PLASTERING'],
  };
  const related = relatedGroups[jobCategory] ?? [];
  if (trades.some((t) => related.includes(t))) return 0.5;
  if (trades.includes('GENERAL_MAINTENANCE')) return 0.3;
  return 0.1;
}

export function estimateResponseTime(tradie: TradieCandidate, distanceKm: number): number {
  const travelMins = Math.ceil(distanceKm * 2.5); // ~25km/h average urban speed
  const prepMins = tradie.activeJobCount > 0 ? 30 : 10;
  return travelMins + prepMins;
}
