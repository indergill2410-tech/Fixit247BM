'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { resetPasswordSchema, type ResetPasswordValues } from '@/lib/validators/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Supabase sends the recovery token in the URL hash as an access_token.
  // onAuthStateChange fires with event=PASSWORD_RECOVERY when the page loads
  // with that token, giving us an authenticated session to call updateUser().
  React.useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // Also check if we already have a recovery session (e.g. after a fast redirect)
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  async function onSubmit(values: ResetPasswordValues) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      toast.error('Failed to reset password. Your reset link may have expired — please request a new one.');
      return;
    }

    setDone(true);
    toast.success('Password updated successfully!');
    setTimeout(() => { router.push('/login'); }, 2000);
  }

  if (!ready) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="text-brand-200">Validating your reset link…</p>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Password updated!</h1>
        <p className="mt-3 text-brand-200">Redirecting you to login…</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Set new password</h1>
        <p className="mt-2 text-brand-200">Choose a strong password for your account</p>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardContent className="px-6 pb-6 pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="text-sm font-medium text-white/90">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="new-password"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium text-white/90">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="border-white/20 bg-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => { setShowConfirm(!showConfirm); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="mt-1 w-full bg-white font-semibold text-brand-700 shadow-lg hover:bg-white/90"
            >
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
