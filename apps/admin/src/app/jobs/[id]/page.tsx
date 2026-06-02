'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, Button } from '@fixit247/ui';
import { ArrowLeft, AlertTriangle, User, Briefcase, CreditCard, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
  } | null;
  customer: {
    user: { firstName: string; lastName: string; email: string; avatarUrl: string | null };
  } | null;
  tradie: {
    businessName: string | null;
    user: { firstName: string; lastName: string; email: string; avatarUrl: string | null } | null;
  } | null;
  payment: {
    amount: number;
    status: string;
    platformFee: number;
    paidAt: string | null;
  } | null;
  events: {
    id: string;
    type: string;
    actorId: string | null;
    actorRole: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
  }[];
  claims: {
    id: string;
    quotedPrice: number;
    isAccepted: boolean;
    createdAt: string;
    tradie: { user: { firstName: string; lastName: string } | null } | null;
  }[];
}

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  DISPUTED: 'bg-red-100 text-red-700',
  CLAIMED: 'bg-purple-100 text-purple-700',
  EN_ROUTE: 'bg-teal-100 text-teal-700',
  ARRIVED: 'bg-cyan-100 text-cyan-700',
  DRAFT: 'bg-gray-100 text-gray-500',
};

const TERMINAL_STATUSES = ['COMPLETED', 'CANCELLED'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatAUD(amount: number) {
  return `$${Number(amount).toFixed(2)} AUD`;
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
      {initials || '?'}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [reason, setReason] = useState('');

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`);
      if (res.ok) {
        const d = await res.json();
        setJob(d.job);
      } else {
        toast.error('Failed to load job');
      }
    } catch {
      toast.error('Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  async function handleAction(action: 'CANCEL' | 'FORCE_COMPLETE') {
    if (!reason.trim()) { toast.error('Please provide a reason'); return; }
    setActionLoading(action);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      if (res.ok) {
        toast.success(action === 'CANCEL' ? 'Job cancelled' : 'Job marked complete');
        setShowCancelModal(false);
        setShowCompleteModal(false);
        setReason('');
        fetchJob();
      } else {
        const d = await res.json();
        toast.error(d.error ?? 'Failed');
      }
    } catch {
      toast.error('Failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function redispatch() {
    setActionLoading('DISPATCH');
    try {
      const res = await fetch(`/api/admin/jobs/${id}/dispatch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (res.ok) { toast.success('Re-dispatch triggered'); fetchJob(); }
      else { const d = await res.json(); toast.error(d.error ?? 'Failed'); }
    } catch {
      toast.error('Failed');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-muted/60" />
          <div className="h-48 rounded-xl bg-muted/60" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-muted/60" />)}
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!job) {
    return (
      <AdminShell>
        <p className="text-muted-foreground">Job not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/jobs"><ArrowLeft size={14} /> Back to Jobs</Link>
        </Button>
      </AdminShell>
    );
  }

  const isTerminal = TERMINAL_STATUSES.includes(job.status);
  const customerName = job.customer ? `${job.customer.user.firstName} ${job.customer.user.lastName}` : 'Unknown';
  const tradieName = job.tradie?.user ? `${job.tradie.user.firstName} ${job.tradie.user.lastName}` : null;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-6">
        <Link href="/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Verifications queue
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {job.isEmergency && <AlertTriangle size={18} className="text-red-500" />}
              <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[job.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {job.status.replace('_', ' ')}
              </span>
              {job.isEmergency && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  Emergency
                </span>
              )}
              <span className="text-xs text-muted-foreground">{job.category.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isTerminal && (
              <Button variant="destructive" size="sm" onClick={() => setShowCancelModal(true)}>
                Force Cancel
              </Button>
            )}
            {job.status === 'IN_PROGRESS' && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowCompleteModal(true)}>
                Force Complete
              </Button>
            )}
            {job.status === 'OPEN' && (
              <Button size="sm" variant="outline" onClick={redispatch} disabled={actionLoading === 'DISPATCH'}>
                {actionLoading === 'DISPATCH' ? 'Dispatching...' : 'Re-dispatch'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main info */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Job details */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Briefcase size={16} />Job Details</h2>
            <p className="mb-4 text-sm text-muted-foreground">{job.description}</p>
            {job.address && (
              <p className="text-sm text-foreground">
                {job.address.street}, {job.address.suburb} {job.address.state} {job.address.postcode}
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium text-foreground">{formatDate(job.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="font-medium text-foreground">{formatDate(job.updatedAt)}</p>
              </div>
              {job.completedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-medium text-foreground">{formatDate(job.completedAt)}</p>
                </div>
              )}
              {job.cancelledAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                  <p className="font-medium text-foreground">{formatDate(job.cancelledAt)}</p>
                </div>
              )}
            </div>
            {job.cancelReason && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <strong>Cancel reason:</strong> {job.cancelReason}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><CreditCard size={16} />Payment</h2>
            {job.payment ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">{formatAUD(job.payment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="text-foreground">{formatAUD(job.payment.platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {job.payment.status}
                  </span>
                </div>
                {job.payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid at</span>
                    <span className="text-foreground">{formatDate(job.payment.paidAt)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payment record</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer + Tradie */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><User size={16} />Customer</h2>
            {job.customer ? (
              <div className="flex items-center gap-3">
                <Initials name={customerName} />
                <div>
                  <p className="font-medium text-foreground">{customerName}</p>
                  <p className="text-sm text-muted-foreground">{job.customer.user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No customer data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><User size={16} />Tradie</h2>
            {job.tradie ? (
              <div className="flex items-center gap-3">
                <Initials name={tradieName ?? job.tradie.businessName ?? 'Unknown'} />
                <div>
                  <p className="font-medium text-foreground">{tradieName ?? job.tradie.businessName ?? 'Unknown Tradie'}</p>
                  {job.tradie.businessName && tradieName && <p className="text-sm text-foreground">{job.tradie.businessName}</p>}
                  {job.tradie.user?.email && <p className="text-sm text-muted-foreground">{job.tradie.user.email}</p>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Unassigned</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><Clock size={16} />Event Timeline</h2>
          {job.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events recorded</p>
          ) : (
            <div className="relative space-y-0">
              {job.events.map((event, idx) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-background ring-offset-2" />
                    {idx < job.events.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{event.type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
                    {event.actorRole && (
                      <p className="text-xs text-muted-foreground">by {event.actorRole}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Force Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Force Cancel Job</h3>
            <p className="mb-4 text-sm text-muted-foreground">This will immediately cancel the job. Please provide a reason.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="mb-4 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowCancelModal(false); setReason(''); }}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleAction('CANCEL')} disabled={actionLoading === 'CANCEL'}>
                {actionLoading === 'CANCEL' ? 'Cancelling...' : 'Confirm Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Force Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Force Complete Job</h3>
            <p className="mb-4 text-sm text-muted-foreground">This will mark the job as completed. Please provide a reason.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for force completion..."
              className="mb-4 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowCompleteModal(false); setReason(''); }}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('FORCE_COMPLETE')} disabled={actionLoading === 'FORCE_COMPLETE'}>
                {actionLoading === 'FORCE_COMPLETE' ? 'Completing...' : 'Confirm Complete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
