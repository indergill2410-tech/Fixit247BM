import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@fixit247/ui';

export const metadata: Metadata = { title: 'Access Denied' };

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="mb-4 text-6xl">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
        <p className="mt-2 text-gray-500">You don&apos;t have permission to view this page.</p>
        <Button asChild className="mt-6"><Link href="/dashboard">Back to dashboard</Link></Button>
      </div>
    </div>
  );
}
