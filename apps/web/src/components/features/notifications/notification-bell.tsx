'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNotifications } from '@/lib/socket/hooks';
import { toast } from 'sonner';

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const TYPE_COLORS: Record<string, string> = {
  JOB_ACCEPTED: 'bg-green-100',
  TRADIE_EN_ROUTE: 'bg-brand-500/20',
  TRADIE_ARRIVED: 'bg-brand-500/30',
  JOB_COMPLETED: 'bg-purple-100',
  PAYMENT_RELEASED: 'bg-green-100',
  PAYMENT_FAILED: 'bg-red-100',
  DISPUTE_OPENED: 'bg-red-100',
  NEW_MESSAGE: 'bg-gray-100',
  CREDIT_LOW: 'bg-orange-100',
  DEFAULT: 'bg-gray-100',
};

export function NotificationBell({ initialUnreadCount = 0 }: { initialUnreadCount?: number }) {
  const [open, setOpen] = useState(false);
  const [serverNotifs, setServerNotifs] = useState<{ id: string; type: string; title: string; body: string; createdAt: string }[]>([]);
  const [loadingServer, setLoadingServer] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { notifications: socketNotifs, unreadCount: socketUnread, markRead, markAllRead } = useNotifications();

  const totalUnread = initialUnreadCount + socketUnread;

  // Load server-persisted notifications when panel opens
  useEffect(() => {
    if (!open) return;
    setLoadingServer(true);
    fetch('/api/notifications?limit=20')
      .then((r) => r.json())
      .then((data) => setServerNotifs(data.notifications ?? []))
      .catch(() => {})
      .finally(() => setLoadingServer(false));
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function handleMarkAllRead() {
    markAllRead();
    await fetch('/api/notifications/all/read', { method: 'PATCH' }).catch(() => {});
    setServerNotifs((prev) => prev.map((n) => ({ ...n })));
    toast.success('All notifications marked as read');
  }

  async function handleMarkRead(id: string) {
    markRead(id);
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
  }

  const allNotifs = [
    ...socketNotifs.map((n) => ({ ...n, isNew: true })),
    ...serverNotifs.map((n) => ({ ...n, isNew: false })),
  ].filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i).slice(0, 30);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
          >
            {totalUnread > 9 ? '9+' : totalUnread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {allNotifs.length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {loadingServer ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={20} className="animate-spin text-gray-300" />
                </div>
              ) : allNotifs.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={28} className="mx-auto text-gray-200" />
                  <p className="mt-2 text-sm text-gray-400">All caught up!</p>
                </div>
              ) : (
                allNotifs.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id)}
                    className="flex w-full items-start gap-3 border-b px-4 py-3 text-left last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${(notif as { isNew?: boolean }).isNew ? 'bg-brand-500' : 'bg-transparent'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{notif.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{notif.body}</p>
                      <p className="mt-1 text-[10px] text-gray-300">{formatTimeAgo(notif.createdAt)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
