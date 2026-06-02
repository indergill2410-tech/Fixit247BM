import type { Metadata } from 'next';
import Link from 'next/link';
import { FxIcon } from '@/components/ui/fx-icon';

export const metadata: Metadata = { title: 'Messages | Fixit247' };

export default function MessagesPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400 mb-4">
        <FxIcon name="message" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        Your conversations with tradies will appear here once you have an active job.
      </p>
      <Link
        href="/jobs/new"
        className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
      >
        Post a job to get started →
      </Link>
    </div>
  );
}
