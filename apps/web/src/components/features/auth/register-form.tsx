'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, Wrench, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { FxIcon } from '@/components/ui/fx-icon';
import { registerSchema, type RegisterValues } from '@/lib/validators/auth';

type RoleOption = 'CUSTOMER' | 'TRADIE';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') ?? '';
  const showPlanBanner = plan === 'fixit-plus-home' || plan === 'fixit-plus-total';
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleOption>('CUSTOMER');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER', acceptTerms: true },
  });

  function handleRoleSelect(role: RoleOption) {
    setSelectedRole(role);
    setValue('role', role);
  }

  async function onSubmit(values: RegisterValues) {
    // Route through the API so the server can write role to app_metadata
    // (service-role-only) rather than user-writable user_metadata.
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const json = await res.json() as { error?: string; userId?: string; requiresVerification?: boolean };

    if (!res.ok) {
      if (res.status === 409) {
        toast.error('An account with this email already exists', {
          action: { label: 'Log in', onClick: () => { router.push('/login'); } },
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
      return;
    }

    toast.success('Account created! Check your email to verify your address.', { duration: 6000 });
    router.push('/verify-email?email=' + encodeURIComponent(values.email));
    void json;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
        <p className="mt-2 text-foreground-muted">Join Australia&apos;s trusted trades platform</p>
      </div>

      <Card className="border-border bg-background-elevated shadow-card-warm">
        <CardContent className="px-6 pb-6 pt-8">
          {showPlanBanner && (
            <div className="mb-6 rounded-xl bg-brand-500/10 border border-brand-500/20 px-4 py-3 flex items-center gap-3">
              <FxIcon name="shield" size={16} className="text-brand-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Starting your {plan === 'fixit-plus-total' ? 'Plus Total' : 'Plus Home'} free trial</p>
                <p className="text-xs text-foreground-muted">14 days free — no credit card needed</p>
              </div>
            </div>
          )}
          {/* Role selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => { handleRoleSelect(value as RoleOption); }}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                  selectedRole === value
                    ? 'border-brand-500/60 bg-brand-500/10 text-foreground'
                    : 'border-border bg-background text-foreground-muted hover:border-border-strong hover:bg-background-alt'
                }`}
              >
                <Icon size={22} />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-foreground-subtle">{description}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <input type="hidden" {...register('role')} value={selectedRole} />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    autoComplete="given-name"
                    className="border-border bg-background pl-10 text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand-500/40"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  autoComplete="family-name"
                  className="border-border bg-background text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand-500/40"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="border-border bg-background pl-10 text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand-500/40"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="border-border bg-background pl-10 pr-10 text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand-500/40"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => { setShowPassword(!showPassword); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                id="acceptTerms"
                type="checkbox"
                defaultChecked
                className="mt-0.5 h-4 w-4 rounded accent-brand-500"
                {...register('acceptTerms')}
              />
              <label htmlFor="acceptTerms" className="text-xs text-foreground-muted leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-foreground hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="mt-1 w-full bg-brand-500 font-semibold text-gray-900 shadow-brand-md hover:bg-brand-400"
            >
              <ShieldCheck size={18} />
              Create account — free
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-foreground-subtle">
            No credit card required. No spam. Cancel anytime.
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}

const ROLE_OPTIONS = [
  { value: 'CUSTOMER', label: 'I need help', description: 'Book a tradie', icon: User },
  { value: 'TRADIE', label: "I'm a tradie", description: 'Find work', icon: Wrench },
];
