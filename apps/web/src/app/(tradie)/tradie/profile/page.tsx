import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { db } from '@fixit247/database';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import Link from 'next/link';
import { Pencil, Star, Shield, Clock, Briefcase, Phone, Mail, DollarSign } from 'lucide-react';

export const metadata: Metadata = { title: 'My Profile | Fixit247 Tradie' };
export const dynamic = 'force-dynamic';

const TRADE_LABELS: Record<string, string> = {
  PLUMBING: 'Plumbing', ELECTRICAL: 'Electrical', HVAC: 'HVAC',
  CARPENTRY: 'Carpentry', PAINTING: 'Painting', ROOFING: 'Roofing',
  TILING: 'Tiling', PEST_CONTROL: 'Pest Control', LOCKSMITH: 'Locksmith',
  GLAZING: 'Glazing', PLASTERING: 'Plastering', LANDSCAPING: 'Landscaping',
  CLEANING: 'Cleaning', APPLIANCE_REPAIR: 'Appliance Repair',
  GENERAL_MAINTENANCE: 'General Maintenance', OTHER: 'Other',
};

export default async function TradieProfilePage() {
  const session = await requireRole('TRADIE');

  const [tradieProfile, user] = await Promise.all([
    db.tradieProfile.findUnique({
      where: { userId: session.id },
      include: {
        licences: { orderBy: { createdAt: 'desc' }, take: 1 },
        insurances: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
    db.user.findUnique({
      where: { id: session.id },
      select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true },
    }),
  ]);

  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const rating = tradieProfile?.avgRating ? Number(tradieProfile.avgRating) : null;

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="My Profile"
        description="Your public tradie profile visible to customers"
        actions={
          <Button asChild size="sm">
            <Link href="/tradie/profile/edit">
              <Pencil size={14} className="mr-1.5" />
              Edit Profile
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-500/20 text-3xl font-bold text-brand-400">
                  {user?.avatarUrl
                    ? <img src={user.avatarUrl} alt={fullName} className="h-20 w-20 rounded-2xl object-cover" />
                    : fullName.charAt(0) || '?'
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-white">{fullName}</h2>
                      {tradieProfile?.businessName && (
                        <p className="text-sm text-gray-400">{tradieProfile.businessName}</p>
                      )}
                    </div>
                    <Badge variant={tradieProfile?.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>
                      {tradieProfile?.verificationStatus === 'VERIFIED' ? 'Verified' : tradieProfile?.verificationStatus ?? 'Unverified'}
                    </Badge>
                  </div>

                  {rating && rating > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'} />
                      ))}
                      <span className="text-sm font-semibold text-gray-300">{rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({tradieProfile?.totalReviews ?? 0} reviews)</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(tradieProfile?.trades ?? []).map((trade) => (
                      <span key={trade} className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-medium text-brand-400">
                        {TRADE_LABELS[trade] ?? trade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {tradieProfile?.bio && (
                <div className="mt-5 border-t border-white/8 pt-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{tradieProfile.bio}</p>
                </div>
              )}

              {!tradieProfile?.bio && (
                <div className="mt-5 border-t border-white/8 pt-4">
                  <p className="text-sm text-gray-500 italic">No bio added yet. Add one to attract more customers.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-500 shrink-0" />
                <span className="text-gray-300">{user?.email ?? '—'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-500 shrink-0" />
                <span className="text-gray-300">{user?.phone ?? 'No phone number added'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Profile Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-400"><Briefcase size={14} />Jobs Completed</span>
                <span className="font-semibold text-white">{tradieProfile?.totalJobsCompleted ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-400"><Clock size={14} />Response Time</span>
                <span className="font-semibold text-white">
                  {tradieProfile?.responseTimeMinutes ? `${tradieProfile.responseTimeMinutes} min` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-400"><Shield size={14} />Completion Rate</span>
                <span className="font-semibold text-white">
                  {tradieProfile?.completionRate ? `${Number(tradieProfile.completionRate).toFixed(0)}%` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-400"><DollarSign size={14} />Hourly Rate</span>
                <span className="font-semibold text-white">
                  {tradieProfile?.hourlyRate ? `$${Number(tradieProfile.hourlyRate).toFixed(0)}/hr` : 'Quote based'}
                </span>
              </div>
              {tradieProfile?.yearsExperience !== undefined && tradieProfile.yearsExperience !== null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-400"><Briefcase size={14} />Experience</span>
                  <span className="font-semibold text-white">{tradieProfile.yearsExperience} years</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-400">Service Radius</span>
                <span className="font-semibold text-white">{tradieProfile?.serviceRadiusKm ?? 25} km</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Verification</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Licence</span>
                <span className={tradieProfile?.licences?.[0] ? 'text-green-400' : 'text-amber-400'}>
                  {tradieProfile?.licences?.[0] ? tradieProfile.licences[0]?.status : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Insurance</span>
                <span className={tradieProfile?.insurances?.[0] ? 'text-green-400' : 'text-amber-400'}>
                  {tradieProfile?.insurances?.[0] ? tradieProfile.insurances[0]?.status : 'Missing'}
                </span>
              </div>
              <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                <Link href="/tradie/documents">Manage Documents</Link>
              </Button>
            </CardContent>
          </Card>

          <Button asChild size="sm" className="w-full" variant="outline">
            <Link href="/tradie/profile/edit">
              <Pencil size={14} className="mr-1.5" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
