'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { getSocket, connectSocket } from './client';
import type { ServerToClientEvents, TradieLocation, JobStatusUpdate, MessagePayload, DispatchUpdate, NotificationPayload } from '@fixit247/realtime';

// Generic typed socket event hook
export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K],
  deps: unknown[] = []
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (...args: any[]) => { (handlerRef.current as (...a: any[]) => void)(...args); };
    socket.on(event as string, listener as never);
    return () => { socket.off(event as string, listener as never); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

// Connect socket and auto-join user room
export function useSocketConnection(userId: string | undefined, role: string | undefined) {
  useEffect(() => {
    if (!userId || !role) return;
    const socket = connectSocket(userId, role);
    return () => { socket.disconnect(); };
  }, [userId, role]);
}

// Subscribe to real-time updates for a specific job
export function useJobSubscription(jobId: string | undefined) {
  useEffect(() => {
    if (!jobId) return;
    const socket = getSocket();
    socket.emit('job:subscribe', { jobId });
    return () => { socket.emit('job:unsubscribe', { jobId }); };
  }, [jobId]);
}

// Real-time job status updates
export function useRealTimeJobStatus(jobId: string | undefined, initialStatus: string) {
  const [status, setStatus] = useState(initialStatus);
  const [lastUpdate, setLastUpdate] = useState<JobStatusUpdate | null>(null);

  useJobSubscription(jobId);

  useSocketEvent('job:status_changed', (payload) => {
    if (payload.jobId === jobId) {
      setStatus(payload.status);
      setLastUpdate(payload);
    }
  }, [jobId]);

  return { status, lastUpdate };
}

// Real-time tradie location
export function useRealTimeTracking(jobId: string | undefined) {
  const [location, setLocation] = useState<TradieLocation | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  useSocketEvent('tradie:location_update', (payload) => {
    if (payload.jobId === jobId) setLocation(payload);
  }, [jobId]);

  useSocketEvent('job:tradie_en_route', (payload) => {
    if (payload.jobId === jobId) setEtaMinutes(payload.etaMinutes);
  }, [jobId]);

  useSocketEvent('tradie:location_stopped', (payload) => {
    if (payload.jobId === jobId) setLocation(null);
  }, [jobId]);

  return { location, etaMinutes };
}

// Real-time chat messages for a job
export function useRealTimeChat(jobId: string | undefined) {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ userId: string; userName: string }[]>([]);

  useSocketEvent('message:new', (payload) => {
    if (payload.jobId === jobId) {
      setMessages((prev) => {
        // Avoid duplicates (optimistic UI reconciliation)
        if (prev.find((m) => m.id === payload.id)) return prev;
        return [...prev, payload];
      });
    }
  }, [jobId]);

  useSocketEvent('message:typing', (payload) => {
    if (payload.jobId !== jobId) return;
    setTypingUsers((prev) => {
      const without = prev.filter((u) => u.userId !== payload.userId);
      return payload.isTyping ? [...without, { userId: payload.userId, userName: payload.userName }] : without;
    });
  }, [jobId]);

  const sendTypingStart = useCallback(() => {
    if (!jobId) return;
    getSocket().emit('message:typing_start', { jobId });
  }, [jobId]);

  const sendTypingStop = useCallback(() => {
    if (!jobId) return;
    getSocket().emit('message:typing_stop', { jobId });
  }, [jobId]);

  return { messages, setMessages, typingUsers, sendTypingStart, sendTypingStop };
}

// Real-time dispatch status (customer sees finding-tradie updates)
export function useDispatchFeedback(jobId: string | undefined) {
  const [phase, setPhase] = useState<DispatchUpdate['phase']>('SEARCHING');
  const [message, setMessage] = useState('Finding the best tradie for you…');
  const [batchNumber, setBatchNumber] = useState(0);

  useSocketEvent('dispatch:update', (payload) => {
    if (payload.jobId === jobId) {
      setPhase(payload.phase);
      setMessage(payload.message);
      setBatchNumber(payload.batchNumber ?? 0);
    }
  }, [jobId]);

  return { phase, message, batchNumber };
}

// Real-time in-app notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useSocketEvent('notification:new', (payload) => {
    setNotifications((prev) => [payload, ...prev]);
    setUnreadCount((c) => c + 1);
  });

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markRead, markAllRead };
}

// Tradie GPS broadcasting during a job
export function useLocationBroadcast(jobId: string | undefined, enabled: boolean) {
  const watchIdRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (jobId) getSocket().emit('tradie:location_stop', { jobId });
  }, [jobId]);

  useEffect(() => {
    if (!enabled || !jobId || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        getSocket().emit('tradie:location_update', {
          jobId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
        });
      },
      (err) => { console.warn('[location]', err.message); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return stop;
  }, [enabled, jobId, stop]);

  return { stop };
}
