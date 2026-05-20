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

// Track typing state to debounce stop events
const typingTimers = new Map<string, NodeJS.Timeout>();

export function registerMessageHandlers(io: IoServer, socket: IoSocket): void {
  const { userId, role } = socket.data;

  // Real-time message delivery — REST API persists to DB, socket delivers instantly
  socket.on('message:send', async (payload) => {
    const { jobId, content, type, mediaUrl } = payload;

    // Emit to job room (all participants including sender for multi-device support)
    io.to(ROOMS.job(jobId)).emit('message:new', {
      id: `tmp_${Date.now()}`, // replaced by DB id on client reconciliation
      jobId,
      senderId: userId,
      senderName: '', // populated by client from their user store
      senderRole: role,
      content,
      type,
      isSystem: false,
      createdAt: new Date().toISOString(),
      ...(mediaUrl !== undefined && { mediaUrl }),
    });
  });

  // Typing indicators — debounced stop
  socket.on('message:typing_start', ({ jobId }) => {
    const key = `${userId}:${jobId}`;

    // Clear existing auto-stop timer
    const existing = typingTimers.get(key);
    if (existing) clearTimeout(existing);

    socket.to(ROOMS.job(jobId)).emit('message:typing', {
      jobId,
      userId,
      userName: '',
      isTyping: true,
    });

    // Auto-stop after 5s of no activity
    typingTimers.set(
      key,
      setTimeout(() => {
        socket.to(ROOMS.job(jobId)).emit('message:typing', {
          jobId,
          userId,
          userName: '',
          isTyping: false,
        });
        typingTimers.delete(key);
      }, 5000)
    );
  });

  socket.on('message:typing_stop', ({ jobId }) => {
    const key = `${userId}:${jobId}`;
    const timer = typingTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      typingTimers.delete(key);
    }
    socket.to(ROOMS.job(jobId)).emit('message:typing', {
      jobId,
      userId,
      userName: '',
      isTyping: false,
    });
  });

  // Read receipt — emit to job room so sender sees it
  socket.on('message:mark_read', ({ jobId, messageId }) => {
    socket.to(ROOMS.job(jobId)).emit('message:read', {
      messageId,
      readAt: new Date().toISOString(),
      readBy: userId,
    });
  });
}
