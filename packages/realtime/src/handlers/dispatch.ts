import type { Server } from 'socket.io';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '../events';
import { ROOMS } from '../rooms';
import type { DispatchUpdate } from '../events';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// Called by the matching engine / API routes to push dispatch status to customer
export function emitDispatchUpdate(io: IoServer, customerId: string, update: DispatchUpdate): void {
  io.to(ROOMS.user(customerId)).emit('dispatch:update', update);
  io.to(ROOMS.adminLive()).emit('admin:job_feed', { type: 'dispatch_update', data: update });
}

export function emitJobOffer(
  io: IoServer,
  tradieIds: string[],
  offer: Parameters<ServerToClientEvents['job:new_offer']>[0]
): void {
  for (const tradieId of tradieIds) {
    io.to(ROOMS.tradie(tradieId)).emit('job:new_offer', offer);
    io.to(ROOMS.user(tradieId)).emit('job:new_offer', offer);
  }
  io.to(ROOMS.adminLive()).emit('admin:job_feed', { type: 'job_offer_sent', data: offer });
}

export function emitJobStatusChange(
  io: IoServer,
  jobId: string,
  update: Parameters<ServerToClientEvents['job:status_changed']>[0]
): void {
  io.to(ROOMS.job(jobId)).emit('job:status_changed', update);
  io.to(ROOMS.adminLive()).emit('admin:job_feed', { type: 'status_change', data: update });
}

export function emitNotification(
  io: IoServer,
  userId: string,
  notif: Parameters<ServerToClientEvents['notification:new']>[0]
): void {
  io.to(ROOMS.user(userId)).emit('notification:new', notif);
}
