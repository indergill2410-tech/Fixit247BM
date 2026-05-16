import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/features/auth/login-form';

export const metadata: Metadata = { title: 'Log In' };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
