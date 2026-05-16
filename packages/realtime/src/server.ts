import { Server } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './events';
import { socketAuthMiddleware } from './middleware';
import { registerMessageHandlers } from './handlers/message';
import { registerTrackingHandlers } from './handlers/tracking';
import { registerJobHandlers } from './handlers/job';
import { ROOMS } from './rooms';

export function createSocketServer(httpServer: import('http').Server): Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
      origin: [
        process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
        process.env['NEXT_PUBLIC_ADMIN_URL'] ?? 'http://localhost:3001',
      ],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 20000,
    pingInterval: 10000,
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    const { userId, role } = socket.data;

    // Auto-join user's personal room for notifications
    socket.join(ROOMS.user(userId));

    registerJobHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTrackingHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`[socket] disconnect uid=${userId} reason=${reason}`);
    });
  });

  return io;
}

export { ROOMS };
export * from './events';
export * from './handlers/dispatch';
