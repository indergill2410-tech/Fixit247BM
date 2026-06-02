'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, Button } from '@fixit247/ui';
import { ArrowLeft, ShieldCheck, User, FileText, Shield, Star, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface TradieDetail {
  id: string;
  businessName: string | null;
  abn: string | null;
  trades: string[];
  verificationStatus: string;
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
  };
  licences: {
    id: string;
    licenceType: string;
    licenceNumber: string;
    state: string;
    expiresAt: string | null;
    status: string;
  }[];
  insurances: {
    id: string;
    insurer: string;
    policyNumber: string;
    coverAmount: number;
    expiresAt: string;
    status: string;
  }[];
  jobs: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    completedAt: string | null;
  }[];
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  reviewer: { firstName: string; lastName: string };
}

const STATUS_BADGE: Record<string, string> = {
  VERIFIED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
  UNVERIFIED: 'bg-gray-100 text-gray-600',
  SUSPENDED: 'bg-red-100 text-red-700',
};

const JOB_STATUS_BADGE: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  OPEN: 'bg-blue-100 text-blue-700',
};

const TRADE_LABELS: Record<string, string> = {
  PLUMBING: 'Plumbing', ELECTRICAL: 'Electrical', HVAC: 'HVAC',
  LOCKSMITH: 'Locksmith', ROOFING: 'Roofing', CARPENTRY: 'Carpentry',
  PAINTING: 'Painting', TILING: 'Tiling', GLAZING: 'Glazing',
  PEST_CONTROL: 'Pest Control', PLASTERING: 'Plastering', LANDSCAPING: 'Landscaping',
  CLEANING: 'Cleaning', APPLIANCE_REPAIR: 'Appliance Repair', GENERAL_MAINTENANCE: 'General Maintenance',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Initials({ name }: { name: string }) {
  const parts = name.split(' ');
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-base font-bold text-amber-700">
      {parts.map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

export default function VerificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<TradieDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verifications/${id}`);
      if (res.ok) {
        const d = await res.json();
        setProfile(d.profile);
        setReviews(d.reviews ?? []);
      } else {
        toast.error('Failed to load tradie profile');
      }
    } catch {
      toast.error('Failed to load tradie profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleApprove() {
    setActionLoading('APPROVE');
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      });
      if (res.ok) {
        toast.success('Tradie verified successfully');
        router.push('/verifications');
      } else {
        const d = await res.json();
        toast.error(d.error ?? 'Failed to approve');
      }
    } catch {
      toast.error('Failed to approve');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) { toast.error('Please provide a rejection reason'); return; }
    setActionLoading('REJECT');
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT', reason: rejectReason }),
      });
      if (res.ok) {
        toast.success('Verification rejected');
        router.push('/verifications');
      } else {
        const d = await res.json();
        toast.error(d.error ?? 'Failed to reject');
      }
    } catch {
      toast.error('Failed to reject');
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
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 rounded-xl bg-muted/60" />
            <div className="h-40 rounded-xl bg-muted/60" />
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!profile) {
    return (
      <AdminShell>
        <p className="text-muted-foreground">Tradie not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/verifications"><ArrowLeft size={14} /> Back to verifications</Link>
        </Button>
      </AdminShell>
    );
  }

  const fullName = `${profile.user.firstName} ${profile.user.lastName}`;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-6">
        <Link href="/verifications" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Verifications queue
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Initials name={fullName} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
              <p className="text-sm text-muted-foreground">{profile.user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[profile.verificationStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                  {profile.verificationStatus}
                </span>
              </div>
            </div>
          </div>
          {profile.verificationStatus === 'PENDING' && (
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={actionLoading !== null}
              >
                <ShieldCheck size={14} />
                {actionLoading === 'APPROVE' ? 'Approving...' : 'Approve Verification'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading !== null}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tradie Info Card */}
      <Card className="mb-6">
        <CardContent className="pt-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><User size={16} />Tradie Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Business Name</p>
              <p className="font-medium text-foreground">{profile.businessName ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ABN</p>
              <p className="font-medium text-foreground">{profile.abn ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="font-medium text-foreground">{formatDate(profile.user.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <div className="flex items-center gap-1">
                <StarRating rating={Math.round(Number(profile.avgRating))} />
                <span className="font-medium text-foreground">{Number(profile.avgRating).toFixed(1)} ({profile.totalReviews})</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-1 text-xs text-muted-foreground">Trades</p>
            <div className="flex flex-wrap gap-1">
              {profile.trades.map((t) => (
                <span key={t} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {TRADE_LABELS[t] ?? t}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Licences */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><FileText size={16} />Licences</h2>
            {profile.licences.length === 0 ? (
              <p className="text-sm text-muted-foreground">No licences uploaded</p>
            ) : (
              <div className="space-y-3">
                {profile.licences.map((lic) => (
                  <div key={lic.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground">{lic.licenceType}</p>
                      <p className="text-xs text-muted-foreground">#{lic.licenceNumber} · {lic.state}</p>
                      {lic.expiresAt && (
                        <p className="text-xs text-muted-foreground">Expires: {formatDate(lic.expiresAt)}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[lic.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {lic.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insurances */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><Shield size={16} />Insurance</h2>
            {profile.insurances.length === 0 ? (
              <p className="text-sm text-muted-foreground">No insurance uploaded</p>
            ) : (
              <div className="space-y-3">
                {profile.insurances.map((ins) => (
                  <div key={ins.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground">{ins.insurer}</p>
                      <p className="text-xs text-muted-foreground">Policy #{ins.policyNumber}</p>
                      <p className="text-xs text-muted-foreground">Cover: ${Number(ins.coverAmount).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Expires: {formatDate(ins.expiresAt)}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[ins.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {ins.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Jobs */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><Briefcase size={16} />Recent Jobs</h2>
            {profile.jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs yet</p>
            ) : (
              <div className="space-y-2">
                {profile.jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(job.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${JOB_STATUS_BADGE[job.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><Star size={16} />Recent Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    {review.title && <p className="mt-1 text-sm font-medium text-foreground">{review.title}</p>}
                    {review.body && <p className="text-xs text-muted-foreground">{review.body}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">
                      — {review.reviewer.firstName} {review.reviewer.lastName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Reject Verification</h3>
            <p className="mb-4 text-sm text-muted-foreground">Please provide a reason for rejecting this verification. This will be recorded.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="mb-4 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowRejectModal(false); setRejectReason(''); }}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={actionLoading === 'REJECT'}>
                {actionLoading === 'REJECT' ? 'Rejecting...' : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
