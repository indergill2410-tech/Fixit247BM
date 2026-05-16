import type { Socket } from 'socket.io';
import type { SocketData } from './events';

export function socketAuthMiddleware(
  socket: Socket<unknown, unknown, unknown, SocketData>,
  next: (err?: Error) => void
): void {
  const auth = socket.handshake.auth as { userId?: string; role?: string; token?: string };

  if (!auth.userId || !auth.role) {
    next(new Error('AUTH_REQUIRED'));
    return;
  }

  // Attach verified identity to socket data
  socket.data.userId = auth.userId;
  socket.data.role = auth.role;

  next();
}
