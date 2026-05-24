'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ShieldCheck, Briefcase, Clock, CreditCard, CheckCircle,
  Upload, Info,
} from 'lucide-react';
import { Button, Card, CardContent, Input, Badge } from '@fixit247/ui';
import {
  tradieBusinessSchema,
  tradieVerificationSchema,
  tradieProfileSchema,
  tradieAvailabilitySchema,
  type TradieBusinessValues,
  type TradieVerificationValues,
  type TradieProfileValues,
  type TradieAvailabilityValues,
} from '@/lib/validators/onboarding';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

// ─── Step Definitions ────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Business Details', icon: Building2 },
  { id: 2, label: 'Verification', icon: ShieldCheck },
  { id: 3, label: 'Your Profile', icon: Briefcase },
  { id: 4, label: 'Availability', icon: Clock },
  { id: 5, label: 'Get Paid', icon: CreditCard },
];

const TRADE_CATEGORIES = [
  'PLUMBING', 'ELECTRICAL', 'HVAC', 'CARPENTRY', 'PAINTING',
  'ROOFING', 'TILING', 'PEST_CONTROL', 'LOCKSMITH', 'GLAZING',
  'PLASTERING', 'LANDSCAPING', 'CLEANING', 'APPLIANCE_REPAIR',
  'GENERAL_MAINTENANCE', 'OTHER',
] as const;

const TRADE_LABELS: Record<string, string> = {
  PLUMBING: '🔧 Plumbing', ELECTRICAL: '⚡ Electrical', HVAC: '❄️ HVAC',
  CARPENTRY: '🪵 Carpentry', PAINTING: '🖌️ Painting', ROOFING: '🏠 Roofing',
  TILING: '🔲 Tiling', PEST_CONTROL: '🐛 Pest Control', LOCKSMITH: '🔑 Locksmith',
  GLAZING: '🪟 Glazing', PLASTERING: '🏗️ Plastering', LANDSCAPING: '🌿 Landscaping',
  CLEANING: '🧹 Cleaning', APPLIANCE_REPAIR: '🔌 Appliances', GENERAL_MAINTENANCE: '🛠️ General', OTHER: '📦 Other',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ─── Main Component ───────────────────────────────────────────────────────────

export function TradieOnboarding() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [step, setStep] = React.useState(1);
  const [isComplete, setIsComplete] = React.useState(false);

  // Per-step form data stored in state
  const [formData, setFormData] = React.useState<{
    business?: TradieBusinessValues;
    verification?: TradieVerificationValues;
    profile?: TradieProfileValues;
    availability?: TradieAvailabilityValues;
  }>({});

  function handleStepComplete<T>(stepData: T, stepKey: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [stepKey]: stepData }));
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  }

  async function handleFinalStep(availability: TradieAvailabilityValues) {
    const payload = {
      business: formData.business,
      verification: formData.verification,
      profile: formData.profile,
      availability,
    };

    const res = await fetch('/api/onboarding/tradie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? 'Failed to save your profile. Please try again.');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    await supabase.auth.updateUser({ data: { onboardingComplete: true } });
    await refreshUser();
    setIsComplete(true);
    setTimeout(() => { router.push('/tradie/dashboard'); }, 2000);
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Application submitted!</h2>
        <p className="max-w-sm text-brand-200">
          Your profile is under review. We&apos;ll verify your documents and notify you within 24 hours.
        </p>
        <p className="text-sm text-brand-300/70">Taking you to your dashboard…</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Step progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isCompleted = s.id < step;
            const isActive = s.id === step;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted ? 'border-green-500 bg-green-500' :
                    isActive ? 'border-white bg-white/20' :
                    'border-white/20 bg-transparent'
                  }`}>
                    {isCompleted ? <CheckCircle size={16} className="text-white" /> : <Icon size={16} className={isActive ? 'text-white' : 'text-white/30'} />}
                  </div>
                  <span className={`hidden text-xs sm:block ${isActive ? 'text-white font-medium' : isCompleted ? 'text-green-400' : 'text-white/30'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 mx-1 h-0.5 transition-colors ${s.id < step ? 'bg-green-500' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-brand-300 sm:hidden">
          Step {step} of {STEPS.length} — {STEPS[step - 1]?.label}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && <Step1Business key="s1" onNext={(d) => { handleStepComplete(d, 'business'); }} />}
        {step === 2 && <Step2Verification key="s2" onBack={() => { setStep(1); }} onNext={(d) => { handleStepComplete(d, 'verification'); }} />}
        {step === 3 && <Step3Profile key="s3" onBack={() => { setStep(2); }} onNext={(d) => { handleStepComplete(d, 'profile'); }} />}
        {step === 4 && <Step4Availability key="s4" onBack={() => { setStep(3); }} onNext={(d) => { handleStepComplete(d, 'availability'); }} />}
        {step === 5 && <Step5Payments key="s5" onBack={() => { setStep(4); }} onNext={handleFinalStep} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Step 1: Business Details ─────────────────────────────────────────────────

function Step1Business({ onNext }: { onNext: (d: TradieBusinessValues) => void }) {
  const [selectedTrades, setSelectedTrades] = React.useState<string[]>([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TradieBusinessValues>({
    resolver: zodResolver(tradieBusinessSchema),
    defaultValues: { serviceRadiusKm: 25, serviceSuburbs: [] },
  });

  function toggleTrade(t: string) {
    const next = selectedTrades.includes(t)
      ? selectedTrades.filter((x) => x !== t)
      : [...selectedTrades, t];
    setSelectedTrades(next);
    setValue('trades', next, { shouldValidate: true });
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Business details</h2>
            <p className="mt-1 text-sm text-brand-300">Tell customers who you are and what you do</p>
          </div>
          <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/90">Business / Trading name</label>
              <Input placeholder="Smith Plumbing Services" className="border-white/20 bg-white/10 text-white placeholder:text-white/30" error={errors.businessName?.message} {...register('businessName')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/90">ABN <span className="text-white/40">(optional)</span></label>
              <Input placeholder="12 345 678 901" className="border-white/20 bg-white/10 text-white placeholder:text-white/30" error={errors.abn?.message} {...register('abn')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/90">Mobile number</label>
              <Input type="tel" placeholder="04XX XXX XXX" className="border-white/20 bg-white/10 text-white placeholder:text-white/30" error={errors.phone?.message} {...register('phone')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/90">Trade categories <span className="text-red-400">*</span></label>
              <div className="flex flex-wrap gap-2">
                {TRADE_CATEGORIES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { toggleTrade(t); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedTrades.includes(t)
                        ? 'bg-white text-brand-700'
                        : 'border border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {TRADE_LABELS[t] ?? t}
                  </button>
                ))}
              </div>
              {errors.trades && <p className="text-xs text-red-400">{errors.trades.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/90">Bio <span className="text-white/40">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="Tell customers about your experience and what sets you apart…"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                {...register('bio')}
              />
            </div>
            <Button type="submit" size="lg" className="bg-white font-semibold text-brand-700 hover:bg-white/90">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Step 2: Verification ─────────────────────────────────────────────────────

function Step2Verification({ onBack, onNext }: { onBack: () => void; onNext: (d: TradieVerificationValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TradieVerificationValues>({
    resolver: zodResolver(tradieVerificationSchema),
    defaultValues: { hasLicense: false, hasInsurance: false },
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Verification documents</h2>
            <p className="mt-1 text-sm text-brand-300">Trust is at the heart of Fixit247. Verified tradies get more jobs.</p>
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-xl bg-brand-500/10 p-4">
            <Info size={16} className="mt-0.5 shrink-0 text-brand-300" />
            <p className="text-sm text-brand-200">
              All documents are reviewed within 24 hours. You can start your profile while we verify.
            </p>
          </div>

          <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-6">
            {/* Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-600 text-center text-xs leading-6 text-white">1</div>
                <h3 className="font-semibold text-white">Identity verification</h3>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <Upload size={20} className="text-brand-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Upload ID</p>
                  <p className="text-xs text-white/50">Drivers licence, passport, or Medicare card</p>
                </div>
                <span className="text-xs text-white/30">Optional at signup</span>
              </label>
            </div>

            {/* Trade Licence */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-600 text-center text-xs leading-6 text-white">2</div>
                <h3 className="font-semibold text-white">Trade licence</h3>
              </div>
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <input type="checkbox" className="mt-0.5 accent-white" {...register('hasLicense')} />
                <div>
                  <p className="text-sm font-medium text-white">I hold a valid trade licence</p>
                  <p className="text-xs text-white/50">Required for electrical, plumbing, gas fitting etc.</p>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/70">Licence number</label>
                  <Input placeholder="e.g. 205123C" className="border-white/20 bg-white/10 text-sm text-white placeholder:text-white/30" {...register('licenceNumber')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/70">Issued by (State)</label>
                  <Input placeholder="e.g. NSW Fair Trading" className="border-white/20 bg-white/10 text-sm text-white placeholder:text-white/30" {...register('licenceState')} />
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-600 text-center text-xs leading-6 text-white">3</div>
                <h3 className="font-semibold text-white">Public liability insurance</h3>
              </div>
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <input type="checkbox" className="mt-0.5 accent-white" {...register('hasInsurance')} />
                <div>
                  <p className="text-sm font-medium text-white">I have valid public liability insurance</p>
                  <p className="text-xs text-white/50">Minimum $5M coverage recommended</p>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/70">Insurer</label>
                  <Input placeholder="e.g. CGU Insurance" className="border-white/20 bg-white/10 text-sm text-white placeholder:text-white/30" {...register('insurer')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/70">Policy number</label>
                  <Input placeholder="e.g. PLI-12345" className="border-white/20 bg-white/10 text-sm text-white placeholder:text-white/30" {...register('policyNumber')} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={onBack}>Back</Button>
              <Button type="submit" size="lg" className="flex-1 bg-white font-semibold text-brand-700 hover:bg-white/90">Continue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Step 3: Professional Profile ────────────────────────────────────────────

function Step3Profile({ onBack, onNext }: { onBack: () => void; onNext: (d: TradieProfileValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TradieProfileValues>({
    resolver: zodResolver(tradieProfileSchema),
    defaultValues: { yearsExperience: 1 },
  });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Professional profile</h2>
            <p className="mt-1 text-sm text-brand-300">Help customers understand your expertise and rates</p>
          </div>
          <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/90">Years of experience</label>
              <Input
                type="number"
                min={0}
                max={60}
                className="border-white/20 bg-white/10 text-white"
                error={errors.yearsExperience?.message}
                {...register('yearsExperience', { valueAsNumber: true })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/90">Hourly rate <span className="text-white/40">(AUD)</span></label>
                <Input
                  type="number"
                  placeholder="85"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                  error={errors.hourlyRate?.message}
                  {...register('hourlyRate', { valueAsNumber: true })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/90">Call-out fee <span className="text-white/40">(AUD)</span></label>
                <Input
                  type="number"
                  placeholder="60"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                  error={errors.calloutFee?.message}
                  {...register('calloutFee', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <Upload size={18} className="text-brand-400" />
                <div>
                  <p className="text-sm font-medium text-white">Add portfolio photos</p>
                  <p className="text-xs text-white/50">Before/after shots — can be added later from your profile</p>
                </div>
              </label>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={onBack}>Back</Button>
              <Button type="submit" size="lg" className="flex-1 bg-white font-semibold text-brand-700 hover:bg-white/90">Continue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Step 4: Availability ─────────────────────────────────────────────────────

function Step4Availability({ onBack, onNext }: { onBack: () => void; onNext: (d: TradieAvailabilityValues) => void }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TradieAvailabilityValues>({
    resolver: zodResolver(tradieAvailabilitySchema),
    defaultValues: {
      isEmergencyAvailable: false,
      acceptsSameDay: false,
      emergencyResponseMinutes: 60,
      emergencySurchargePercent: 50,
      availability: DAYS.map((_, i) => ({
        dayOfWeek: i,
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: i >= 1 && i <= 5, // Mon-Fri default
      })),
    },
  });

  const avail = watch('availability');

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Availability & emergency settings</h2>
            <p className="mt-1 text-sm text-brand-300">Set when you work and configure emergency response</p>
          </div>
          <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
            {/* Emergency toggle */}
            <div className="space-y-3">
              <label className="flex cursor-pointer items-start justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">⚡ Emergency availability</p>
                  <p className="text-xs text-white/60 mt-0.5">Accept emergency jobs 24/7 with a surcharge</p>
                </div>
                <input type="checkbox" className="mt-1 accent-red-500" {...register('isEmergencyAvailable')} />
              </label>
              <label className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">🚀 Same-day jobs</p>
                  <p className="text-xs text-white/60 mt-0.5">Accept jobs that need to start today</p>
                </div>
                <input type="checkbox" className="mt-1 accent-white" {...register('acceptsSameDay')} />
              </label>
            </div>

            {/* Weekly schedule */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/90">Working hours</p>
              {DAYS.map((day, i) => (
                <div key={day} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${avail[i]?.isAvailable ? 'bg-white/5' : 'opacity-40'}`}>
                  <input type="checkbox" className="accent-white" {...register(`availability.${i}.isAvailable`)} />
                  <span className="w-20 text-xs text-white/80">{day}</span>
                  <input type="time" className="rounded bg-white/10 px-2 py-1 text-xs text-white" disabled={!avail[i]?.isAvailable} {...register(`availability.${i}.startTime`)} />
                  <span className="text-white/40 text-xs">to</span>
                  <input type="time" className="rounded bg-white/10 px-2 py-1 text-xs text-white" disabled={!avail[i]?.isAvailable} {...register(`availability.${i}.endTime`)} />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={onBack}>Back</Button>
              <Button type="submit" size="lg" className="flex-1 bg-white font-semibold text-brand-700 hover:bg-white/90">Continue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Step 5: Payments (Stripe Connect) ────────────────────────────────────────

function Step5Payments({ onBack, onNext }: { onBack: () => void; onNext: (d: TradieAvailabilityValues) => void }) {
  const [isConnecting, setIsConnecting] = React.useState(false);

  async function handleStripeConnect() {
    setIsConnecting(true);
    const res = await fetch('/api/payments/connect/onboarding', { method: 'POST' });
    const { url, error } = await res.json() as { url?: string; error?: string };
    if (url) {
      window.location.href = url;
    } else {
      toast.error(error ?? 'Failed to start Stripe onboarding');
      setIsConnecting(false);
    }
  }

  async function handleSkip() {
    // Allow skipping Stripe — can complete later
    const fakeAvailability: TradieAvailabilityValues = {
      isEmergencyAvailable: false,
      acceptsSameDay: false,
      emergencyResponseMinutes: 60,
      emergencySurchargePercent: 50,
      availability: [],
    };
    onNext(fakeAvailability);
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Set up payments</h2>
            <p className="mt-1 text-sm text-brand-300">Connect your bank account to receive payouts</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                  <span className="text-xl">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Stripe Connect</p>
                  <p className="text-xs text-white/60">Secure · Insured · Australian-compliant</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/80">
                {[
                  'Direct bank deposits every Monday',
                  'Platform fee of 15% per completed job',
                  'Dispute protection included',
                  'Instant payout available (fee applies)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="button"
              loading={isConnecting}
              size="lg"
              className="w-full bg-white font-semibold text-brand-700 hover:bg-white/90"
              onClick={handleStripeConnect}
            >
              Connect bank account
            </Button>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={onBack}>Back</Button>
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 text-center text-sm text-brand-300 hover:text-white"
              >
                Skip for now — I&apos;ll do this later
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
