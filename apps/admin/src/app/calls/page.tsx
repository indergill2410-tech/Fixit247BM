'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import { Phone, PhoneOff, Mic, AlertTriangle, UserCheck, RefreshCw, Radio, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceCall {
  id: string;
  twilioCallSid: string | null;
  phoneNumber: string;
  direction: string;
  status: string;
  duration: number | null;
  startedAt: string;
  answeredAt: string | null;
  customer: { firstName: string; lastName: string; phone: string } | null;
  conversation: { status: string; isEmergency: boolean; urgencyScore: number | null; turnCount: number } | null;
  assessment: { riskLevel: string; emergencyScore: number } | null;
  events: { eventType: string; createdAt: string }[];
}

interface CallsData {
  calls: VoiceCall[];
  stats: { status: string; _count: { id: number } }[];
}

const STATUS_COLORS: Record<string, string> = {
  IN_PROGRESS: 'bg-green-100 text-green-700',
  AI_HANDLING: 'bg-blue-100 text-blue-700',
  HUMAN_TAKEOVER: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-gray-100 text-gray-500',
  FAILED: 'bg-red-100 text-red-700',
  ABANDONED: 'bg-yellow-100 text-yellow-700',
};

const RISK_COLORS: Record<string, string> = {
  LIFE_THREATENING: 'text-red-700 bg-red-50 border-red-200',
  CRITICAL: 'text-orange-700 bg-orange-50 border-orange-200',
  HIGH: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  MEDIUM: 'text-blue-700 bg-blue-50 border-blue-200',
  LOW: 'text-gray-600 bg-gray-50 border-gray-200',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function callDuration(startedAt: string): string {
  const secs = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CallCenterPage() {
  const [data, setData] = useState<CallsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<string>('active');
  const [takingOver, setTakingOver] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const statusParam = filter === 'active' ? 'IN_PROGRESS' : filter === 'ai' ? 'AI_HANDLING' : '';
      const res = await fetch(`/api/admin/voice/calls?${statusParam ? `status=${statusParam}&` : ''}limit=30`);
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  async function handleTakeover(callId: string) {
    setTakingOver(callId);
    try {
      const res = await fetch(`/api/admin/voice/calls/${callId}/takeover`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      toast.success('You have taken over this call');
      fetchData();
    } catch { toast.error('Takeover failed'); }
    finally { setTakingOver(null); }
  }

  const activeCalls = data?.calls.filter((c) => ['IN_PROGRESS', 'AI_HANDLING', 'HUMAN_TAKEOVER'].includes(c.status)) ?? [];
  const emergencyCalls = data?.calls.filter((c) => c.conversation?.isEmergency) ?? [];
  const statCount = (status: string) => data?.stats.find((s) => s.status === status)?._count.id ?? 0;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Call Center</h1>
            <span className={`flex h-2.5 w-2.5 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Live AI voice call monitoring &amp; intervention</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh((v) => !v)}>
            <Radio size={14} className={autoRefresh ? 'text-green-500' : ''} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Active Calls" value={activeCalls.length} icon="📞" />
        <StatCard title="Emergency Calls" value={emergencyCalls.length} icon="🚨" delta={emergencyCalls.length > 0 ? 'Priority' : 'All clear'} />
        <StatCard title="Human Takeovers" value={statCount('HUMAN_TAKEOVER')} icon="👤" />
        <StatCard title="Completed Today" value={statCount('COMPLETED')} icon="✅" />
      </div>

      {/* Emergency banner */}
      {emergencyCalls.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-600 px-5 py-4 text-white">
          <AlertTriangle size={20} className="shrink-0" />
          <div>
            <p className="font-bold">{emergencyCalls.length} active emergency call{emergencyCalls.length > 1 ? 's' : ''}</p>
            <p className="text-sm text-red-200">Requires immediate attention — consider taking over</p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {['all', 'active', 'ai', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f === 'ai' ? 'AI Handling' : f}
          </button>
        ))}
      </div>

      {/* Calls list */}
      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)
        ) : !data?.calls.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-400">
            <Phone size={32} className="mx-auto mb-2 opacity-30" />
            <p>No calls match the current filter</p>
          </div>
        ) : data.calls.map((call) => {
          const isActive = ['IN_PROGRESS', 'AI_HANDLING'].includes(call.status);
          const riskStyle = call.assessment ? RISK_COLORS[call.assessment.riskLevel] ?? '' : '';

          return (
            <div key={call.id} className={`rounded-2xl border bg-white p-5 ${call.conversation?.isEmergency ? 'border-red-200' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Status icon */}
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {isActive ? <Mic size={16} className="text-green-600" /> : <PhoneOff size={16} className="text-gray-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {call.customer ? `${call.customer.firstName} ${call.customer.lastName}` : call.phoneNumber}
                      </p>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[call.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {call.status.replace(/_/g, ' ')}
                      </span>
                      {call.conversation?.isEmergency && (
                        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                          <AlertTriangle size={10} /> EMERGENCY
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(call.startedAt)}</span>
                      {isActive && <span className="font-mono text-green-600">{callDuration(call.startedAt)}</span>}
                      {call.conversation && <span>{call.conversation.turnCount} turns</span>}
                      {call.conversation?.urgencyScore != null && (
                        <span className={`font-semibold ${call.conversation.urgencyScore >= 70 ? 'text-red-600' : call.conversation.urgencyScore >= 40 ? 'text-orange-600' : 'text-gray-500'}`}>
                          Urgency: {call.conversation.urgencyScore}/100
                        </span>
                      )}
                    </div>

                    {call.assessment && (
                      <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskStyle}`}>
                        <AlertTriangle size={10} />
                        {call.assessment.riskLevel.replace(/_/g, ' ')} risk · Score {call.assessment.emergencyScore}/100
                      </div>
                    )}

                    {/* Recent events */}
                    {call.events.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {call.events.slice(0, 3).map((ev, i) => (
                          <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                            {ev.eventType.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  {isActive && call.status !== 'HUMAN_TAKEOVER' && (
                    <Button
                      size="sm"
                      onClick={() => handleTakeover(call.id)}
                      disabled={takingOver === call.id}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                    >
                      {takingOver === call.id ? <RefreshCw size={12} className="animate-spin" /> : <UserCheck size={12} />}
                      Take Over
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
