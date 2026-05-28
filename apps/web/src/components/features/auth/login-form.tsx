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
// Rejects // and /\ prefixes — browsers normalise /\ to https:// making it an open redirect.
function sanitiseRedirectTo(raw: string | null): string {
  if (!raw) return '/dashboard';
  return raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\') ? raw : '/dashboard';
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitiseRedirectTo(searchParams.get('redirectTo'));
  // Surface OAuth/callback errors passed as ?error= query param
  const urlError = searchParams.get('error');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [showGoogleRoleSelect, setShowGoogleRoleSelect] = React.useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  function fillDemo(email: string, password: string) {
    setValue('email', email, { shouldValidate: false });
    setValue('password', password, { shouldValidate: false });
  }

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

  // Step 1: show role selector before OAuth so tradies don't get stranded
  function handleGoogleLogin() {
    setShowGoogleRoleSelect(true);
  }

  // Step 2: initiate OAuth with selected role passed through the callback URL
  async function handleGoogleOAuth(role: 'CUSTOMER' | 'TRADIE') {
    setShowGoogleRoleSelect(false);
    setIsGoogleLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}&googleRole=${role}`,
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
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-foreground-muted">Log in to your Fixit247 account</p>
      </div>

      <Card className="border-border bg-background-elevated shadow-card-warm dark:shadow-glass">
        <CardContent className="px-6 pb-6 pt-8">
          {urlError && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {urlError === 'auth_callback_failed'
                ? 'Google sign-in failed. Please try again or use email and password.'
                : 'An error occurred. Please try again.'}
            </div>
          )}

          {/* Google SSO first — reduces friction */}
          {showGoogleRoleSelect ? (
            <div className="rounded-2xl border border-border bg-background-alt p-4">
              <p className="mb-3 text-center text-sm font-semibold text-foreground">
                Are you signing in as a customer or a tradie?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleGoogleOAuth('CUSTOMER')}
                  className="flex-1 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-foreground transition-all hover:bg-background-alt"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => void handleGoogleOAuth('TRADIE')}
                  className="flex-1 rounded-xl border border-brand-500/40 bg-brand-500/10 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-500/20 dark:text-brand-400"
                >
                  Tradie
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setShowGoogleRoleSelect(false); }}
                className="mt-2 w-full text-center text-xs text-foreground-subtle hover:text-foreground-muted"
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
              className="w-full border-border bg-background text-foreground hover:bg-background-alt"
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

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-foreground-subtle">or sign in with email</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <Input
                  id="email"
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="border-border bg-background pl-10 pr-10 text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand-500/40"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => { setShowPassword(!showPassword); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
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
              className="mt-1 w-full bg-brand-500 font-semibold text-gray-900 shadow-brand-md hover:bg-brand-400"
            >
              Log in
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-foreground-subtle">
            Trusted by 30,000+ Australians. No spam, ever.
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          Sign up free
        </Link>
      </p>

      {/* Demo accounts */}
      <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Try a demo account</p>
          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold text-gray-500">DEMO</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {[
            { label: 'Login as Homeowner', email: 'emma.williams@demo.fixit247.com',    password: 'Demo1234!' },
            { label: 'Login as Tradie',    email: 'mike.torres@demo.fixit247.com',      password: 'Demo1234!' },
            { label: 'Login as Admin',     email: 'admin@demo.fixit247.com.au',         password: 'Demo1234!' },
          ].map(({ label, email, password }) => (
            <button
              key={email}
              type="button"
              onClick={() => { fillDemo(email, password); }}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-semibold text-gray-400 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-gray-600">Pre-fills credentials only — you still click Log in</p>
      </div>
    </motion.div>
  );
}
