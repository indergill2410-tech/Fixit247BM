'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Phone, Bell, User } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { customerOnboardingSchema, type CustomerOnboardingValues } from '@/lib/validators/onboarding';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;

const STEPS = [
  { id: 1, label: 'Your details', icon: User },
  { id: 2, label: 'Your location', icon: MapPin },
  { id: 3, label: 'Preferences', icon: Bell },
];

export function CustomerOnboarding() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [step, setStep] = React.useState(1);
  const [isComplete, setIsComplete] = React.useState(false);

  const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm<CustomerOnboardingValues>({
    resolver: zodResolver(customerOnboardingSchema),
    defaultValues: {
      notifyBySms: true,
      notifyByEmail: true,
    },
  });

  async function goNext() {
    const fieldsPerStep: (keyof CustomerOnboardingValues)[][] = [
      ['firstName', 'lastName', 'phone'],
      ['street', 'suburb', 'postcode', 'state'],
      ['notifyBySms', 'notifyByEmail'],
    ];
    const valid = await trigger(fieldsPerStep[step - 1]);
    if (valid) setStep(step + 1);
  }

  async function onSubmit(values: CustomerOnboardingValues) {
    const res = await fetch('/api/onboarding/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const { error } = await res.json() as { error?: string };
      toast.error(error ?? 'Failed to save your profile. Please try again.');
      return;
    }

    // Mark onboarding complete in Supabase metadata
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.updateUser({ data: { onboardingComplete: true } });
    await refreshUser();

    setIsComplete(true);
    setTimeout(() => { router.push('/dashboard'); }, 2000);
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
        <h2 className="text-2xl font-bold text-white">You&apos;re all set!</h2>
        <p className="text-brand-200">Taking you to your dashboard…</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Set up your account</h1>
        <p className="mt-1 text-sm text-brand-300">Step {step} of {STEPS.length}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                s.id < step
                  ? 'bg-green-500 text-white'
                  : s.id === step
                  ? 'bg-white text-brand-700'
                  : 'bg-white/10 text-white/40'
              }`}>
                {s.id < step ? <CheckCircle size={14} /> : s.id}
              </div>
              {s.id < STEPS.length && (
                <div className={`h-0.5 w-8 transition-colors ${s.id < step ? 'bg-green-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardContent className="px-6 py-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Your details</h2>
                    <p className="text-sm text-brand-300">Tell us a bit about yourself</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/90">First name</label>
                      <Input
                        placeholder="Jane"
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/90">Last name</label>
                      <Input
                        placeholder="Smith"
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/90">Mobile number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        type="tel"
                        placeholder="04XX XXX XXX"
                        className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/30"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                    </div>
                    <p className="text-xs text-white/40">Used for job updates and emergencies. Australian numbers only.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Your location</h2>
                    <p className="text-sm text-brand-300">Where do you need services?</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/90">Street address</label>
                    <Input
                      placeholder="123 Main Street"
                      className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                      error={errors.street?.message}
                      {...register('street')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/90">Suburb</label>
                      <Input
                        placeholder="Surry Hills"
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                        error={errors.suburb?.message}
                        {...register('suburb')}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/90">Postcode</label>
                      <Input
                        placeholder="2010"
                        maxLength={4}
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/30"
                        error={errors.postcode?.message}
                        {...register('postcode')}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/90">State / Territory</label>
                    <select
                      className="flex h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                      {...register('state')}
                    >
                      <option value="" className="bg-brand-900">Select state…</option>
                      {AU_STATES.map((s) => <option key={s} value={s} className="bg-brand-900">{s}</option>)}
                    </select>
                    {errors.state && <p className="text-xs text-red-400">{errors.state.message}</p>}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Notification preferences</h2>
                    <p className="text-sm text-brand-300">How would you like us to keep you updated?</p>
                  </div>

                  {[
                    { field: 'notifyBySms' as const, label: 'SMS notifications', desc: 'Job updates and tradie ETA via text' },
                    { field: 'notifyByEmail' as const, label: 'Email notifications', desc: 'Job summaries, invoices, and receipts' },
                  ].map(({ field, label, desc }) => (
                    <label key={field} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                      <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 accent-brand-400" {...register(field)} />
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-white/50">{desc}</p>
                      </div>
                    </label>
                  ))}

                  <p className="text-xs text-white/40">You can change these anytime in settings.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => { setStep(step - 1); }}>
                  Back
                </Button>
              )}
              {step < STEPS.length ? (
                <Button type="button" className="flex-1 bg-white font-semibold text-brand-700 hover:bg-white/90" onClick={goNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" loading={isSubmitting} className="flex-1 bg-white font-semibold text-brand-700 hover:bg-white/90">
                  Complete setup
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
