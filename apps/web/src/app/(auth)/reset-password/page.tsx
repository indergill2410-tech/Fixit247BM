import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Create New Password | Fixit 24/7',
  description: 'Create a new password for your Fixit 24/7 account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
