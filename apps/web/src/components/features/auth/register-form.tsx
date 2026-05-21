'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, Wrench, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { registerSchema, type RegisterValues } from '@/lib/validators/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type RoleOption = 'CUSTOMER' | 'TRADIE';

export function RegisterForm() {
  const router = useRouter();
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
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
          onboardingComplete: false,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('An account with this email already exists', {
          action: { label: 'Log in', onClick: () => { router.push('/login'); } },
        });
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Account created! Check your email to verify your address.", {
      duration: 6000,
    });
    router.push('/verify-email?email=' + encodeURIComponent(values.email));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-brand-200">Join Australia&apos;s trusted trades platform</p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardContent className="px-6 pb-6 pt-8">
          {/* Role selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => { handleRoleSelect(value as RoleOption); }}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                  selectedRole === value
                    ? 'border-white/60 bg-white/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <Icon size={22} />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs opacity-70">{description}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <input type="hidden" {...register('role')} value={selectedRole} />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-white/90">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    autoComplete="given-name"
                    className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-white/90">Last name</label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  autoComplete="family-name"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-sm font-medium text-white/90">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-sm font-medium text-white/90">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                  className="border-white/20 bg-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => { setShowPassword(!showPassword); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                id="acceptTerms"
                type="checkbox"
                defaultChecked
                className="mt-0.5 h-4 w-4 rounded accent-white"
                {...register('acceptTerms')}
              />
              <label htmlFor="acceptTerms" className="text-xs text-white/60 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-white hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400">{errors.acceptTerms.message}</p>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="mt-1 w-full bg-white font-semibold text-brand-700 shadow-lg hover:bg-white/90"
            >
              <ShieldCheck size={18} />
              Create account
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-brand-200">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-white hover:underline">
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
