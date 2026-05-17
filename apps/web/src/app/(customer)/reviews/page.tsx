import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Reviews | Fixit247' };

export default function ReviewsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400 mb-4">
        <Star size={32} />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Your Reviews</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        Reviews you&apos;ve left for tradies will appear here. Complete a job to leave your first review.
      </p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
      >
        Go to dashboard →
      </Link>
    </div>
  );
}
