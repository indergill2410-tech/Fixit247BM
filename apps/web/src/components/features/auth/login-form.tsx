'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { loginSchema, type LoginValues } from '@/lib/validators/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// Prevent open-redirect: only allow same-origin relative paths.
function sanitiseRedirectTo(raw: string | null): string {
  if (!raw) return '/dashboard';
  return raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\') ? raw : '/dashboard';
}

// Use NEXT_PUBLIC_SITE_URL so OAuth callbacks work correctly behind reverse proxies
// (window.location.origin resolves to the container's internal address, not the public URL)
function getSiteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? window.location.origin;
}

const SHOW_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const DEMO_ACCOUNTS = [
  {
    email: 'emma.williams@demo.fixit247.com',
    password: 'Demo1234!',
    dest: '/dashboard',
    label: 'Homeowner',
    description: 'Post jobs, hire tradies, track progress',
    icon: '🏠',
    badge: 'Customer view',
    badgeColor: 'bg-blue-500/15 text-blue-400',
  },
  {
    email: 'mike.torres@demo.fixit247.com',
    password: 'Demo1234!',
    dest: '/tradie/dashboard',
    label: 'Tradie',
    description: 'Browse leads, manage jobs & earnings',
    icon: '🔧',
    badge: 'Tradie view',
    badgeColor: 'bg-brand-500/15 text-brand-400',
  },
  {
    email: 'admin@demo.fixit247.com.au',
    password: 'Demo1234!',
    dest: '/admin',
    label: 'Admin',
    description: 'Platform dashboard & user management',
    icon: '⚙️',
    badge: 'Admin view',
    badgeColor: 'bg-purple-500/15 text-purple-400',
  },
] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitiseRedirectTo(searchParams.get('redirectTo'));
  const urlError = searchParams.get('error');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [showGoogleRoleSelect, setShowGoogleRoleSelect] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.message.includes('Invalid login')) {
        toast.error('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email first', {
          action: { label: 'Resend', onClick: () => void handleResendVerification(values.email) },
        });
      } else {
        toast.error(error.message);
      }
      return;
    }

    void supabase.rpc('increment_login_stats', { user_id: data.user.id });

    const role = (data.user.user_metadata as Record<string, unknown>).role;
    const dest =
      redirectTo !== '/dashboard'
        ? redirectTo
        : role === 'TRADIE'
        ? '/tradie/dashboard'
        : role === 'ADMIN' || role === 'SUPER_ADMIN'
        ? '/admin'
        : '/dashboard';

    toast.success('Welcome back!');
    router.push(dest);
    router.refresh();
  }

  async function handleResendVerification(email: string) {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resend({ type: 'signup', email });
    toast.success('Verification email sent');
  }

  async function loginAsDemo(email: string, password: string, dest: string) {
    if (demoLoading || isSubmitting || isGoogleLoading) return;
    setDemoLoading(email);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error('Demo login failed — account may not be seeded yet');
        setDemoLoading(null);
        return;
      }
      toast.success('Signed in as demo user');
      router.push(dest);
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred during demo login');
      setDemoLoading(null);
    }
  }

  function handleGoogleLogin() {
    setShowGoogleRoleSelect(true);
  }

  async function handleGoogleOAuth(role: 'CUSTOMER' | 'TRADIE') {
    setShowGoogleRoleSelect(false);
    setIsGoogleLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getSiteOrigin()}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}&googleRole=${role}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) {
      toast.error('Google login failed. Please try again.');
      setIsGoogleLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-brand-200">Log in to your Fixit247 account</p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardContent className="px-6 pb-6 pt-8">
          {urlError && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {urlError === 'auth_callback_failed'
                ? 'Google sign-in failed. Please try again or use email and password.'
                : 'An error occurred. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white/90">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="email"
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-white/90">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-300 transition-colors hover:text-white">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="border-white/20 bg-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => { setShowPassword(!showPassword); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="mt-1 w-full bg-white font-semibold text-brand-700 shadow-lg hover:bg-white/90"
            >
              Log in
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-white/40">or continue with</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {showGoogleRoleSelect ? (
            <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
              <p className="mb-3 text-center text-sm font-semibold text-white">
                Are you signing in as a customer or a tradie?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleGoogleOAuth('CUSTOMER')}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => void handleGoogleOAuth('TRADIE')}
                  className="flex-1 rounded-xl border border-brand-500/40 bg-brand-500/15 py-3 text-sm font-semibold text-brand-300 transition-all hover:bg-brand-500/25"
                >
                  Tradie
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setShowGoogleRoleSelect(false); }}
                className="mt-2 w-full text-center text-xs text-white/40 hover:text-white/60"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              loading={isGoogleLoading}
              onClick={handleGoogleLogin}
              className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          )}

          {/* Demo accounts — one-click instant login, shown when NEXT_PUBLIC_DEMO_MODE=true */}
          {SHOW_DEMO && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-white/10" />
                <span className="text-xs text-white/40">or try a demo account</span>
                <div className="flex-1 border-t border-white/10" />
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                <div className="divide-y divide-white/6">
                  {DEMO_ACCOUNTS.map(({ email, password, dest, label, description, icon, badge, badgeColor }) => {
                    const isLoading = demoLoading === email;
                    const isDisabled = demoLoading !== null || isSubmitting || isGoogleLoading;
                    return (
                      <button
                        key={email}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => void loginAsDemo(email, password, dest)}
                        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-all hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-lg group-hover:bg-white/[0.08]">
                          {icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-200">{label}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${badgeColor}`}>{badge}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-gray-500">{description}</span>
                        </span>
                        <span className="shrink-0">
                          {isLoading ? (
                            <svg className="h-4 w-4 animate-spin text-brand-400" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-gray-600 transition-colors group-hover:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-white/6 px-5 py-2.5 text-center text-[11px] text-gray-600">
                  One click — instantly signed in, no password needed
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-brand-200">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-white hover:underline">
          Sign up free
        </Link>
      </p>
    </motion.div>
  );
}
