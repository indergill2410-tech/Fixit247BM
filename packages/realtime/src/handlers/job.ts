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

export function registerJobHandlers(io: IoServer, socket: IoSocket): void {
  const { role } = socket.data;

  // Subscribe to real-time updates for a specific job
  socket.on('job:subscribe', ({ jobId }) => {
    void socket.join(ROOMS.job(jobId));
  });

  socket.on('job:unsubscribe', ({ jobId }) => {
    void socket.leave(ROOMS.job(jobId));
  });

  // Admin subscribes to live feed of all jobs
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    socket.on('admin:subscribe_live', () => {
      void socket.join(ROOMS.adminLive());
    });
  }

  socket.on('tradie:heartbeat', ({ tradieId, lat, lng }) => {
    void socket.join(ROOMS.tradie(tradieId));
    if (lat !== undefined && lng !== undefined) {
      io.to(ROOMS.adminLive()).emit('availability:changed', { tradieId, status: 'ONLINE' });
    }
  });

  socket.on('tradie:go_online', ({ tradieId, status }) => {
    void socket.join(ROOMS.tradie(tradieId));
    io.to(ROOMS.adminLive()).emit('availability:changed', { tradieId, status });
  });
}
