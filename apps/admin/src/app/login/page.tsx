import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLoginForm } from '@/components/auth/admin-login-form';

export const metadata: Metadata = { title: 'Admin Sign In' };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense
        fallback={
          <div className="h-[366px] w-full max-w-md animate-pulse rounded-lg border border-gray-200 bg-white shadow-xl" />
        }
      >
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
