// All typed event interfaces for the Fixit247BM real-time system.
// Server-to-client (S2C) and client-to-server (C2S) event maps.

export interface JobOffer {
  jobId: string;
  title: string;
  category: string;
  complexity: string;
  priority: string;
  isEmergency: boolean;
  address: string;
  suburb: string;
  distanceKm: number;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  leadPrice: number;
  creditCost: number;
  urgencyScore: number;
  expiresAt: string;
  batchNumber: number;
}

export interface TradieLocation {
  tradieId: string;
  jobId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp: string;
}

export interface MessagePayload {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  type: string;
  mediaUrl?: string;
  isSystem: boolean;
  createdAt: string;
}

export interface TypingIndicator {
  jobId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface JobStatusUpdate {
  jobId: string;
  status: string;
  previousStatus: string;
  updatedBy: string;
  updatedByRole: string;
  timestamp: string;
  etaMinutes?: number;
  metadata?: Record<string, unknown>;
}

export interface DispatchUpdate {
  jobId: string;
  phase: 'SEARCHING' | 'BATCH_SENT' | 'RE_DISPATCHING' | 'FOUND' | 'NO_TRADIES_AVAILABLE';
  batchNumber?: number;
  tradiesNotified?: number;
  message: string;
  timestamp: string;
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  body: string;
  jobId?: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface ServerToClientEvents {
  // Job offers (tradie receives)
  'job:new_offer': (payload: JobOffer) => void;
  'job:offer_expired': (payload: { jobId: string; batchNumber: number }) => void;
  'job:offer_cancelled': (payload: { jobId: string; reason: string }) => void;

  // Job status (both parties)
  'job:status_changed': (payload: JobStatusUpdate) => void;
  'job:tradie_en_route': (payload: { jobId: string; etaMinutes: number; tradieId: string }) => void;
  'job:tradie_arrived': (payload: { jobId: string; tradieId: string; arrivedAt: string }) => void;
  'job:started': (payload: { jobId: string; startedAt: string }) => void;
  'job:completed': (payload: { jobId: string; completedAt: string }) => void;

  // Live tracking (customer receives)
  'tradie:location_update': (payload: TradieLocation) => void;
  'tradie:location_stopped': (payload: { tradieId: string; jobId: string }) => void;

  // Messaging
  'message:new': (payload: MessagePayload) => void;
  'message:delivered': (payload: { messageId: string; deliveredAt: string }) => void;
  'message:read': (payload: { messageId: string; readAt: string; readBy: string }) => void;
  'message:typing': (payload: TypingIndicator) => void;

  // Dispatch feedback (customer sees)
  'dispatch:update': (payload: DispatchUpdate) => void;

  // Notifications
  'notification:new': (payload: NotificationPayload) => void;

  // Availability
  'availability:changed': (payload: { tradieId: string; status: string }) => void;

  // Admin
  'admin:job_feed': (payload: { type: string; data: Record<string, unknown> }) => void;
  'system:error': (payload: { code: string; message: string }) => void;
}

export interface ClientToServerEvents {
  // Tradie location
  'tradie:location_update': (payload: { jobId: string; lat: number; lng: number; heading?: number; speed?: number; accuracy?: number }) => void;
  'tradie:location_stop': (payload: { jobId: string }) => void;

  // Heartbeat
  'tradie:heartbeat': (payload: { tradieId: string; lat?: number; lng?: number }) => void;
  'tradie:go_online': (payload: { tradieId: string; status: string }) => void;

  // Job subscriptions
  'job:subscribe': (payload: { jobId: string }) => void;
  'job:unsubscribe': (payload: { jobId: string }) => void;

  // Messaging
  'message:send': (payload: { jobId: string; content: string; type: string; mediaUrl?: string }) => void;
  'message:typing_start': (payload: { jobId: string }) => void;
  'message:typing_stop': (payload: { jobId: string }) => void;
  'message:mark_read': (payload: { jobId: string; messageId: string }) => void;

  // Admin subscriptions
  'admin:subscribe_live': () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  role: string;
  tradieId?: string;
}
