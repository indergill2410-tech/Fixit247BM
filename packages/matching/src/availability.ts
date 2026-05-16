export type OnlineStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'EMERGENCY_ONLY' | 'AWAY';

export interface AvailabilityUpdate {
  tradieId: string;
  status: OnlineStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  travelRadiusKm?: number;
  isAutoAccept?: boolean;
}

export const HEARTBEAT_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

export function isHeartbeatStale(lastHeartbeatAt: Date | null): boolean {
  if (!lastHeartbeatAt) return true;
  return Date.now() - lastHeartbeatAt.getTime() > HEARTBEAT_TIMEOUT_MS;
}

export function deriveEffectiveStatus(
  reportedStatus: OnlineStatus,
  lastHeartbeatAt: Date | null,
  activeJobCount: number
): OnlineStatus {
  if (isHeartbeatStale(lastHeartbeatAt)) return 'OFFLINE';
  if (activeJobCount >= 3) return 'BUSY';
  return reportedStatus;
}

export function canAcceptJob(
  status: OnlineStatus,
  isEmergencyJob: boolean,
  activeJobCount: number
): boolean {
  if (status === 'OFFLINE' || status === 'AWAY') return false;
  if (activeJobCount >= 3) return false;
  if (status === 'EMERGENCY_ONLY' && !isEmergencyJob) return false;
  return true;
}
