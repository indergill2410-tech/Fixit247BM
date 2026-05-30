'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { resetPasswordSchema, type ResetPasswordValues } from '@/lib/validators/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [complete, setComplete] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  React.useEffect(() => {
    let mounted = true;

    async function prepareRecoverySession() {
      const supabase = getSupabaseBrowserClient();
      const code = searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          toast.error('This reset link is invalid or expired.');
          router.replace('/forgot-password');
          return;
        }
        router.replace('/reset-password');
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error('Please request a fresh reset link.');
        router.replace('/forgot-password');
        return;
      }

      if (mounted) setReady(true);
    }

    void prepareRecoverySession();
    return () => { mounted = false; };
  }, [router, searchParams]);

  async function onSubmit(values: ResetPasswordValues) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      toast.error('Could not update your password. Please request a fresh reset link.');
      return;
    }

    setComplete(true);
    toast.success('Password updated');
  }

  if (complete) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Password updated</h1>
        <p className="mt-3 text-brand-200">You can now log in with your new password.</p>
        <Button asChild size="lg" className="mt-8 bg-white font-semibold text-brand-700 hover:bg-white/90">
          <Link href="/login">Log in</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Create new password</h1>
        <p className="mt-2 text-brand-200">Choose a strong password for your Fixit247 account</p>
      </div>

      <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <CardContent className="px-6 pb-6 pt-8">
          {!ready ? (
            <div className="py-8 text-center text-sm text-brand-200">Checking reset link...</div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-white/90">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="border-white/20 bg-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => { setShowPassword((value) => !value); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="border-white/20 bg-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => { setShowConfirmPassword((value) => !value); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                size="lg"
                className="w-full bg-white font-semibold text-brand-700 shadow-lg hover:bg-white/90"
              >
                Update password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-brand-200 hover:text-white">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    </motion.div>
  );
}
