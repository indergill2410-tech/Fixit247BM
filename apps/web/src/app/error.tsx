'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-card-warm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl ring-1 ring-red-500/30">
            ⚠️
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm text-foreground-muted">
          An unexpected error occurred. Please try again.
          {error.digest && (
            <span className="mt-1 block text-xs text-foreground-subtle">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-warm-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
