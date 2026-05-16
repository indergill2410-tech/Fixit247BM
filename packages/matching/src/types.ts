export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface JobRequirements {
  jobId: string;
  category: string;
  isEmergency: boolean;
  priority: 'STANDARD' | 'URGENT' | 'EMERGENCY';
  location: GeoPoint;
  suburb: string;
  state: string;
  budgetMin?: number;
  budgetMax?: number;
  scheduledFor?: Date;
  customerId: string;
}

export interface TradieCandidate {
  tradieId: string;
  userId: string;
  trades: string[];
  latitude: number;
  longitude: number;
  trustScore: number;
  avgRating: number;
  totalReviews: number;
  completionRate: number;
  cancellationRate: number;
  responseTimeMinutes: number;
  activeJobCount: number;
  isEmergencyAvailable: boolean;
  isOnline: boolean;
  onlineStatus: string;
  serviceRadiusKm: number;
  verificationStatus: string;
}

export interface MatchScoreBreakdown {
  distanceScore: number;       // 0-30 (30% weight)
  trustScore: number;          // 0-25 (25% weight)
  responseScore: number;       // 0-15 (15% weight)
  availabilityScore: number;   // 0-10 (10% weight)
  ratingScore: number;         // 0-10 (10% weight)
  specializationScore: number; // 0-10 (10% weight)
  totalScore: number;          // 0-100
  distanceKm: number;
}

export interface RankedTradie {
  tradieId: string;
  userId: string;
  scoreBreakdown: MatchScoreBreakdown;
  estimatedResponseMinutes: number;
  isEmergencyMatch: boolean;
}

export interface MatchResult {
  jobId: string;
  ranked: RankedTradie[];
  totalCandidates: number;
  searchRadiusKm: number;
  processingMs: number;
}

export interface DispatchBatch {
  batchNumber: number;
  tradieIds: string[];
  expiresAt: Date;
  jobId: string;
}
