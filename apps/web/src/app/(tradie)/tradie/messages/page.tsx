import type { Metadata } from 'next';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Messages | Fixit247 Tradie' };

export default function TradieMessagesPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400 mb-4">
        <MessageSquare size={32} />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        Your conversations with customers will appear here once you accept a job.
      </p>
      <Link
        href="/tradie/jobs"
        className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
      >
        View available jobs →
      </Link>
    </div>
  );
}
