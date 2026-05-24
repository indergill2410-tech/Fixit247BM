'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. Our team has been notified and will investigate.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
