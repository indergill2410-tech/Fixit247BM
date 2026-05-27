'use client';

import Link from 'next/link';

export default function AuthError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-2xl font-bold text-white">Authentication error</h1>
      <p className="max-w-sm text-sm text-gray-400">
        Something went wrong during sign in. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-gray-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Try again
        </button>
        <Link
          href="/login"
          className="rounded-md border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
