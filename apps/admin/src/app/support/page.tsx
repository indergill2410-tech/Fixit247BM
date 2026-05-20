'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { RefreshCw, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  userId: string;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
}

interface TicketMessage {
  id: string;
  content: string;
  senderType: 'USER' | 'ADMIN';
  createdAt: string;
}

interface SupportData {
  tickets: Ticket[];
  stats: {
    open: number;
    inProgress: number;
    resolved: number;
    avgResponseHours: number;
  };
}

type StatusFilter = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type PriorityFilter = 'ALL' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

const PRIORITY_BADGE: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  LOW: 'bg-gray-100 text-gray-600',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function TicketThread({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}/messages`);
      if (!res.ok) throw new Error('Failed to load messages');
      const json = await res.json();
      setMessages(json.messages ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function sendReply() {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply.trim() }),
      });
      if (!res.ok) throw new Error('Failed to send reply');
      setReply('');
      await fetchMessages();
      toast.success('Reply sent');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Message Thread</p>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">
          Close
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-400">No messages yet</p>
      ) : (
        <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.senderType === 'ADMIN'
                  ? 'ml-auto bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <p>{msg.content}</p>
              <p
                className={`mt-0.5 text-[10px] ${
                  msg.senderType === 'ADMIN' ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {msg.senderType} · {timeAgo(msg.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type a reply…"
          rows={2}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Button size="sm" onClick={sendReply} disabled={sending || !reply.trim()}>
          <Send size={14} />
          {sending ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [data, setData] = useState<SupportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/support?limit=50');
      if (!res.ok) throw new Error('Failed to load support tickets');
      setData(await res.json());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load support');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = (data?.tickets ?? []).filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    return true;
  });

  const STATUS_TABS: StatusFilter[] = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const PRIORITY_TABS: PriorityFilter[] = ['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-1 text-sm text-gray-500">Customer support tickets and responses</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* KPI Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
          ))
        ) : (
          <>
            <StatCard title="Open Tickets" value={data?.stats.open ?? '—'} icon="🎫" />
            <StatCard title="In Progress" value={data?.stats.inProgress ?? '—'} icon="⚡" />
            <StatCard title="Resolved" value={data?.stats.resolved ?? '—'} icon="✅" />
            <StatCard
              title="Avg Response (hrs)"
              value={
                data ? data.stats.avgResponseHours.toFixed(1) : '—'
              }
              icon="⏱️"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex gap-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {PRIORITY_TABS.map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                priorityFilter === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tickets{' '}
            <span className="ml-1 text-sm font-normal text-gray-400">
              ({filtered.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No tickets found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold text-gray-500">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Subject</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Priority</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Created</th>
                    <th className="pb-3 pr-4">Last Activity</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket) => (
                    <>
                      <tr key={ticket.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 pr-4 font-mono text-xs text-gray-500">
                          {ticket.id.slice(0, 8)}
                        </td>
                        <td className="py-3 pr-4 max-w-[200px] truncate font-medium text-gray-800">
                          {ticket.subject}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              STATUS_BADGE[ticket.status] ?? 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              PRIORITY_BADGE[ticket.priority] ?? 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-500">
                          {ticket.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-400">
                          {timeAgo(ticket.createdAt)}
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-400">
                          {timeAgo(ticket.lastMessageAt)}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() =>
                              setExpandedId((prev) =>
                                prev === ticket.id ? null : ticket.id
                              )
                            }
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                          >
                            View
                            {expandedId === ticket.id ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedId === ticket.id && (
                        <tr key={`${ticket.id}-thread`}>
                          <td colSpan={8} className="pb-3 pt-1 pl-4 pr-4">
                            <TicketThread
                              ticketId={ticket.id}
                              onClose={() => setExpandedId(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
