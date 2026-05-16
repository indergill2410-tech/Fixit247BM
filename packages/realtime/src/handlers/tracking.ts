import type { Server, Socket } from 'socket.io';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '../events';
import { ROOMS } from '../rooms';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type IoSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// Rate-limit location updates to max 1 per 3 seconds per socket
const lastUpdateTime = new Map<string, number>();
const RATE_LIMIT_MS = 3000;

export function registerTrackingHandlers(io: IoServer, socket: IoSocket): void {
  const { userId } = socket.data;

  socket.on('tradie:location_update', (payload) => {
    const { jobId, lat, lng, heading, speed, accuracy } = payload;

    // Rate limiting
    const now = Date.now();
    const last = lastUpdateTime.get(socket.id) ?? 0;
    if (now - last < RATE_LIMIT_MS) return;
    lastUpdateTime.set(socket.id, now);

    const locationPayload = {
      tradieId: userId,
      jobId,
      lat,
      lng,
      heading,
      speed,
      accuracy,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to job room (customer + admin see it)
    io.to(ROOMS.job(jobId)).emit('tradie:location_update', locationPayload);
    // Also broadcast to admin live room
    io.to(ROOMS.adminLive()).emit('tradie:location_update', locationPayload);
  });

  socket.on('tradie:location_stop', ({ jobId }) => {
    io.to(ROOMS.job(jobId)).emit('tradie:location_stopped', { tradieId: userId, jobId });
    lastUpdateTime.delete(socket.id);
  });

  socket.on('disconnect', () => {
    lastUpdateTime.delete(socket.id);
  });
}
