'use client';

import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? '', {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket(userId: string, role: string): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { userId, role };
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  socket?.disconnect();
}

// Typed socket events
export interface ServerToClientEvents {
  'job:new_offer': (payload: { jobId: string; job: Record<string, unknown>; expiresAt: string }) => void;
  'job:offer_expired': (payload: { jobId: string }) => void;
  'job:status_changed': (payload: { jobId: string; status: string; tradie?: Record<string, unknown> }) => void;
  'job:tradie_en_route': (payload: { jobId: string; etaMinutes: number }) => void;
  'job:tradie_arrived': (payload: { jobId: string }) => void;
  'availability:updated': (payload: { tradieId: string; status: string }) => void;
  'notification:new': (payload: { id: string; type: string; title: string; body: string }) => void;
}

export interface ClientToServerEvents {
  'tradie:heartbeat': (payload: { tradieId: string; lat?: number; lng?: number }) => void;
  'tradie:go_online': (payload: { tradieId: string; status: string }) => void;
  'job:subscribe': (payload: { jobId: string }) => void;
  'job:unsubscribe': (payload: { jobId: string }) => void;
}
