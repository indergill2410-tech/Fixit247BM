'use client';

import Link from 'next/link';

export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background p-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card-warm">
        <p className="text-sm font-semibold text-brand-600">Dashboard unavailable</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">We could not load this view</h1>
        <p className="mt-3 text-sm text-foreground-muted">
          {error.message || 'The app hit a temporary problem. Please retry or return to your dashboard.'}
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-foreground-subtle">ID: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-warm-950 hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-background-alt"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
