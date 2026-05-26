// ─── matchAndDispatch ─────────────────────────────────────────────────────────
//
// High-level orchestrator: takes a freshly-created Job record, fetches eligible
// tradie candidates from the DB, runs the ranking engine, writes the first
// dispatch batch to JobMatchingQueue, and records a MATCHING_STARTED job event.
//
// This function is designed to be called fire-and-forget from the job creation
// route handler (`void matchAndDispatch(job).catch(...)`).  It must not throw
// synchronously.

import { db } from '@fixit247/database';
import { rankTradies, createDispatchBatch } from './engine';
import type { JobRequirements, TradieCandidate } from './types';

// Shape of the Job object coming from the route handler (db.job.create result)
export interface JobForMatching {
  id: string;
  category: string;
  isEmergency: boolean;
  priority: string;
  customerId: string;
  addressId?: string | null;
  scheduledFor?: Date | null;
  budgetMin?: unknown;
  budgetMax?: unknown;
}

/**
 * Match a newly-created job against available tradies and write the first
 * dispatch batch to the JobMatchingQueue table.
 *
 * Safe to call without await — all errors are surfaced via the returned
 * Promise which the caller should `.catch()`.
 */
export async function matchAndDispatch(job: JobForMatching): Promise<void> {
  // 1. Resolve job location from the address record (if present)
  // If coordinates are missing or default to 0,0 ("Null Island" — off the coast of Africa),
  // we cannot calculate meaningful distances for Australian jobs. Skip dispatch entirely
  // and log for ops visibility so geocoding can be retried.
  let latitude = 0;
  let longitude = 0;
  let suburb = '';
  let state = '';

  if (job.addressId) {
    const address = await db.address.findUnique({
      where: { id: job.addressId },
      select: { latitude: true, longitude: true, suburb: true, state: true },
    });
    if (address) {
      latitude = address.latitude ? Number(address.latitude) : 0;
      longitude = address.longitude ? Number(address.longitude) : 0;
      suburb = address.suburb ?? '';
      state = address.state ?? '';
    }
  }

  // Reject coordinates at or near (0, 0) — no legitimate Australian address maps there.
  // This guards against un-geocoded addresses silently producing wrong match results.
  const hasValidCoords = Math.abs(latitude) > 0.01 || Math.abs(longitude) > 0.01;
  if (!hasValidCoords) {
    await db.jobEvent.create({
      data: {
        jobId: job.id,
        type: 'MATCHING_STARTED',
        metadata: {
          totalCandidates: 0,
          matched: 0,
          skippedReason: 'missing_coordinates',
          addressId: job.addressId ?? null,
        },
      },
    });
    return;
  }

  // 2. Build JobRequirements for the matching engine
  const budgetMin = job.budgetMin ? Number(job.budgetMin) : undefined;
  const budgetMax = job.budgetMax ? Number(job.budgetMax) : undefined;
  const scheduledFor = job.scheduledFor ?? undefined;

  const jobRequirements: JobRequirements = {
    jobId: job.id,
    category: job.category,
    isEmergency: job.isEmergency,
    priority: job.priority as 'STANDARD' | 'URGENT' | 'EMERGENCY',
    location: { latitude, longitude },
    suburb,
    state,
    ...(budgetMin !== undefined ? { budgetMin } : {}),
    ...(budgetMax !== undefined ? { budgetMax } : {}),
    ...(scheduledFor !== undefined ? { scheduledFor } : {}),
    customerId: job.customerId,
  };

  // 3. Fetch tradie candidates from DB — verified tradies who are available
  const tradieCandidates = await db.tradieProfile.findMany({
    where: {
      isAvailable: true,
      verificationStatus: 'VERIFIED',
      isVisible: true,
      ...(job.isEmergency ? { isEmergencyAvailable: true } : {}),
    },
    select: {
      id: true,
      userId: true,
      trades: true,
      serviceRadiusKm: true,
      isEmergencyAvailable: true,
      avgRating: true,
      totalReviews: true,
      completionRate: true,
      cancellationRate: true,
      responseTimeMinutes: true,
      trustScore: true,
    },
  });

  if (tradieCandidates.length === 0) {
    await db.jobEvent.create({
      data: {
        jobId: job.id,
        type: 'MATCHING_STARTED',
        metadata: { totalCandidates: 0, matched: 0, searchRadiusKm: job.isEmergency ? 50 : 30 },
      },
    });
    return;
  }

  // Fetch realtime status for those tradies in a single query
  const tradieIds = tradieCandidates.map((t) => t.id);
  const realtimeStatuses = await db.tradieRealtimeStatus.findMany({
    where: { tradieId: { in: tradieIds } },
    select: {
      tradieId: true,
      onlineStatus: true,
      currentLatitude: true,
      currentLongitude: true,
      activeJobCount: true,
    },
  });
  const rtMap = new Map(realtimeStatuses.map((rt) => [rt.tradieId, rt]));

  // 4. Map DB records to TradieCandidate shape
  const candidates: TradieCandidate[] = tradieCandidates
    .map((t) => {
      const rt = rtMap.get(t.id);
      const lat = rt?.currentLatitude ? Number(rt.currentLatitude) : null;
      const lon = rt?.currentLongitude ? Number(rt.currentLongitude) : null;
      // Skip tradies without a known location
      if (lat === null || lon === null) return null;

      return {
        tradieId: t.id,
        userId: t.userId,
        trades: t.trades as string[],
        latitude: lat,
        longitude: lon,
        trustScore: Number(t.trustScore ?? 0),
        avgRating: Number(t.avgRating ?? 0),
        totalReviews: t.totalReviews ?? 0,
        completionRate: Number(t.completionRate ?? 100),
        cancellationRate: Number(t.cancellationRate ?? 0),
        responseTimeMinutes: t.responseTimeMinutes ?? 60,
        activeJobCount: rt?.activeJobCount ?? 0,
        isEmergencyAvailable: t.isEmergencyAvailable,
        isOnline: rt?.onlineStatus !== 'OFFLINE',
        onlineStatus: (rt?.onlineStatus as string) ?? 'OFFLINE',
        serviceRadiusKm: t.serviceRadiusKm,
        verificationStatus: 'VERIFIED',
      } satisfies TradieCandidate;
    })
    .filter((c): c is TradieCandidate => c !== null);

  // 5. Run the matching engine
  const matchResult = rankTradies(jobRequirements, candidates);

  if (matchResult.ranked.length === 0) {
    // No candidates found — record event and exit
    await db.jobEvent.create({
      data: {
        jobId: job.id,
        type: 'MATCHING_STARTED',
        metadata: {
          totalCandidates: matchResult.totalCandidates,
          matched: 0,
          searchRadiusKm: matchResult.searchRadiusKm,
          processingMs: matchResult.processingMs,
        },
      },
    });
    return;
  }

  // 6. Create first dispatch batch
  const batch = createDispatchBatch(matchResult, 1);
  if (!batch) return;

  // 7. Write to JobMatchingQueue + record job event in a transaction
  await db.$transaction(async (tx) => {
    // Insert queue entries for the first batch
    await tx.jobMatchingQueue.createMany({
      data: matchResult.ranked.slice(0, batch.tradieIds.length).map((ranked) => ({
        jobId: job.id,
        tradieId: ranked.tradieId,
        batchNumber: 1,
        matchScore: ranked.scoreBreakdown.totalScore,
        distanceKm: ranked.scoreBreakdown.distanceKm,
        status: 'PENDING' as const,
        expiresAt: batch.expiresAt,
      })),
      skipDuplicates: true,
    });

    // Record matching started event
    await tx.jobEvent.create({
      data: {
        jobId: job.id,
        type: 'MATCHING_STARTED',
        metadata: {
          totalCandidates: matchResult.totalCandidates,
          matched: matchResult.ranked.length,
          batchSize: batch.tradieIds.length,
          searchRadiusKm: matchResult.searchRadiusKm,
          processingMs: matchResult.processingMs,
        },
      },
    });
  });
}
