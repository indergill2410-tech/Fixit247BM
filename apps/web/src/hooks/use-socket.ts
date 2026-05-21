'use client';

import * as React from 'react';
import { getSocket, connectSocket, type ServerToClientEvents } from '@/lib/socket/client';
import { useAuth } from '@/hooks/use-auth';

export function useSocket() {
  const { user } = useAuth();
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const socket = connectSocket(user.id, user.role ?? 'CUSTOMER');

    socket.on('connect', () => { setConnected(true); });
    socket.on('disconnect', () => { setConnected(false); });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user]);

  return { connected };
}

export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
) {
  React.useEffect(() => {
    const socket = getSocket();
    socket.on(event as string, handler as (...args: unknown[]) => void);
    return () => {
      socket.off(event as string, handler as (...args: unknown[]) => void);
    };
  }, [event, handler]);
}
