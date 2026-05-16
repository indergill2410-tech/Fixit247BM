import type {
  JobRequirements,
  TradieCandidate,
  MatchResult,
  RankedTradie,
  DispatchBatch,
} from './types';
import { calculateMatchScore, estimateResponseTime } from './scorer';

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function rankTradies(
  job: JobRequirements,
  candidates: TradieCandidate[]
): MatchResult {
  const startMs = Date.now();
  const searchRadiusKm = job.isEmergency ? 50 : 30;

  const scored: RankedTradie[] = [];

  for (const tradie of candidates) {
    // Must be online or at least not offline for emergency
    if (tradie.onlineStatus === 'OFFLINE' && !job.isEmergency) continue;
    if (tradie.verificationStatus !== 'VERIFIED') continue;

    // Emergency jobs: only send to emergency-capable tradies
    if (job.isEmergency && !tradie.isEmergencyAvailable) continue;

    // Check if tradie serves this trade category
    if (!tradie.trades.includes(job.category)) continue;

    const distanceKm = haversineDistance(
      job.location.latitude, job.location.longitude,
      tradie.latitude, tradie.longitude
    );

    if (distanceKm > searchRadiusKm) continue;
    if (distanceKm > tradie.serviceRadiusKm && !job.isEmergency) continue;

    const scoreBreakdown = calculateMatchScore(tradie, job, distanceKm);
    const estimatedResponseMinutes = estimateResponseTime(tradie, distanceKm);

    scored.push({
      tradieId: tradie.tradieId,
      userId: tradie.userId,
      scoreBreakdown,
      estimatedResponseMinutes,
      isEmergencyMatch: job.isEmergency && tradie.isEmergencyAvailable,
    });
  }

  scored.sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore);

  return {
    jobId: job.jobId,
    ranked: scored,
    totalCandidates: candidates.length,
    searchRadiusKm,
    processingMs: Date.now() - startMs,
  };
}

export function createDispatchBatch(
  matchResult: MatchResult,
  batchNumber: number,
  batchSize: number = 3
): DispatchBatch | null {
  const startIdx = (batchNumber - 1) * batchSize;
  const batch = matchResult.ranked.slice(startIdx, startIdx + batchSize);

  if (batch.length === 0) return null;

  const expiresAt = new Date();
  // Emergency: 3 minute offer window; standard: 10 minutes
  const offerMinutes = matchResult.ranked[0]?.isEmergencyMatch ? 3 : 10;
  expiresAt.setMinutes(expiresAt.getMinutes() + offerMinutes);

  return {
    batchNumber,
    tradieIds: batch.map((t) => t.tradieId),
    expiresAt,
    jobId: matchResult.jobId,
  };
}

export function shouldEscalatePriority(
  currentBatchNumber: number,
  elapsedMinutes: number,
  isEmergency: boolean
): boolean {
  if (isEmergency && elapsedMinutes > 10) return true;
  if (!isEmergency && currentBatchNumber >= 3 && elapsedMinutes > 45) return true;
  return false;
}
