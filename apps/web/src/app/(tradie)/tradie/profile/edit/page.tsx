'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@fixit247/ui';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const TRADE_CATEGORIES = [
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'CARPENTRY', label: 'Carpentry' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'ROOFING', label: 'Roofing' },
  { value: 'TILING', label: 'Tiling' },
  { value: 'PEST_CONTROL', label: 'Pest Control' },
  { value: 'LOCKSMITH', label: 'Locksmith' },
  { value: 'GLAZING', label: 'Glazing' },
  { value: 'PLASTERING', label: 'Plastering' },
  { value: 'LANDSCAPING', label: 'Landscaping' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'APPLIANCE_REPAIR', label: 'Appliance Repair' },
  { value: 'GENERAL_MAINTENANCE', label: 'General Maintenance' },
  { value: 'OTHER', label: 'Other' },
];

interface ProfileData {
  businessName: string;
  bio: string;
  trades: string[];
  hourlyRate: string;
  calloutFee: string;
  yearsExperience: string;
  serviceRadiusKm: string;
  abn: string;
}

export default function TradieProfileEditPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [form, setForm] = React.useState<ProfileData>({
    businessName: '',
    bio: '',
    trades: [],
    hourlyRate: '',
    calloutFee: '',
    yearsExperience: '',
    serviceRadiusKm: '25',
    abn: '',
  });

  React.useEffect(() => {
    interface ProfileResponse {
      profile?: {
        businessName?: string | null;
        bio?: string | null;
        trades?: string[];
        hourlyRate?: number | null;
        calloutFee?: number | null;
        yearsExperience?: number | null;
        serviceRadiusKm?: number | null;
        abn?: string | null;
      };
    }
    fetch('/api/tradie/profile')
      .then((r) => r.json() as Promise<ProfileResponse>)
      .then((data) => {
        const p = data.profile;
        if (p) {
          setForm({
            businessName: p.businessName ?? '',
            bio: p.bio ?? '',
            trades: p.trades ?? [],
            hourlyRate: p.hourlyRate != null ? String(p.hourlyRate) : '',
            calloutFee: p.calloutFee != null ? String(p.calloutFee) : '',
            yearsExperience: p.yearsExperience != null ? String(p.yearsExperience) : '',
            serviceRadiusKm: p.serviceRadiusKm != null ? String(p.serviceRadiusKm) : '25',
            abn: p.abn ?? '',
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Failed to load profile');
      });
  }, []);

  const toggleTrade = (trade: string) => {
    setForm((prev) => ({
      ...prev,
      trades: prev.trades.includes(trade)
        ? prev.trades.filter((t) => t !== trade)
        : [...prev.trades, trade],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/tradie/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName || undefined,
          bio: form.bio || undefined,
          trades: form.trades,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
          calloutFee: form.calloutFee ? Number(form.calloutFee) : null,
          yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
          serviceRadiusKm: form.serviceRadiusKm ? Number(form.serviceRadiusKm) : undefined,
          abn: form.abn || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      toast.success('Profile updated successfully');
      router.push('/tradie/profile');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell role="TRADIE">
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-400" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="TRADIE">
      <div className="mb-4">
        <Link href="/tradie/profile" className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <ChevronLeft size={16} />
          Back to profile
        </Link>
      </div>

      <PageHeader
        title="Edit Profile"
        description="Update your business details and preferences"
      />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* Business details */}
          <Card>
            <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Business Name</label>
                <Input
                  value={form.businessName}
                  onChange={(e) => { setForm((p) => ({ ...p, businessName: e.target.value })); }}
                  placeholder="Your business name"
                  className="bg-white/4 border-white/8 text-white placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">ABN</label>
                <Input
                  value={form.abn}
                  onChange={(e) => { setForm((p) => ({ ...p, abn: e.target.value })); }}
                  placeholder="11 digit ABN"
                  className="bg-white/4 border-white/8 text-white placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => { setForm((p) => ({ ...p, bio: e.target.value })); }}
                  placeholder="Tell customers about your experience and what you specialise in..."
                  rows={4}
                  className="w-full rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Trade categories */}
          <Card>
            <CardHeader><CardTitle>Trade Categories</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-gray-500">Select all trades you offer services for</p>
              <div className="flex flex-wrap gap-2">
                {TRADE_CATEGORIES.map((cat) => {
                  const selected = form.trades.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => { toggleTrade(cat.value); }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        selected
                          ? 'bg-brand-500 text-gray-900'
                          : 'bg-white/4 text-gray-400 hover:bg-white/8 hover:text-white border border-white/8'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              {form.trades.length === 0 && (
                <p className="mt-2 text-xs text-amber-400">Select at least one trade category</p>
              )}
            </CardContent>
          </Card>

          {/* Pricing & experience */}
          <Card>
            <CardHeader><CardTitle>Pricing & Experience</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Hourly Rate (AUD)</label>
                <Input
                  type="number"
                  min="0"
                  step="5"
                  value={form.hourlyRate}
                  onChange={(e) => { setForm((p) => ({ ...p, hourlyRate: e.target.value })); }}
                  placeholder="e.g. 120"
                  className="bg-white/4 border-white/8 text-white placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Callout Fee (AUD)</label>
                <Input
                  type="number"
                  min="0"
                  step="5"
                  value={form.calloutFee}
                  onChange={(e) => { setForm((p) => ({ ...p, calloutFee: e.target.value })); }}
                  placeholder="e.g. 80"
                  className="bg-white/4 border-white/8 text-white placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Years of Experience</label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={form.yearsExperience}
                  onChange={(e) => { setForm((p) => ({ ...p, yearsExperience: e.target.value })); }}
                  placeholder="e.g. 10"
                  className="bg-white/4 border-white/8 text-white placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Service Radius (km)</label>
                <Input
                  type="number"
                  min="1"
                  max="200"
                  value={form.serviceRadiusKm}
                  onChange={(e) => { setForm((p) => ({ ...p, serviceRadiusKm: e.target.value })); }}
                  placeholder="25"
                  className="bg-white/4 border-white/8 text-white placeholder:text-gray-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save size={16} className="mr-2" />Save Changes</>
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" asChild>
                <Link href="/tradie/profile">Cancel</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
            <p className="text-xs font-semibold text-brand-400 mb-1">Profile visibility</p>
            <p className="text-xs text-gray-500">
              Your profile becomes visible to customers once your identity and licence are verified by our team.
            </p>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
