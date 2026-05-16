'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/validators/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordValues) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error('Something went wrong. Please try again.');
      return;
    }

    setEmail(values.email);
    setSubmitted(true);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Check your email</h1>
            <p className="mt-3 text-brand-200">
              We sent a password reset link to{' '}
              <span className="font-semibold text-white">{email}</span>
            </p>
            <p className="mt-2 text-sm text-brand-300">
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button onClick={() => setSubmitted(false)} className="text-white underline">
                try again
              </button>
            </p>
            <Button asChild variant="outline" size="lg" className="mt-8 border-white/20 text-white hover:bg-white/10">
              <Link href="/login"><ArrowLeft size={16} /> Back to login</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">Reset password</h1>
              <p className="mt-2 text-brand-200">Enter your email and we&apos;ll send a reset link</p>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <CardContent className="px-6 pb-6 pt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reset-email" className="text-sm font-medium text-white/90">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    size="lg"
                    className="w-full bg-white font-semibold text-brand-700 shadow-lg hover:bg-white/90"
                  >
                    Send reset link
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-brand-200 hover:text-white">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
