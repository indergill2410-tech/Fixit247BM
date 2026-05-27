'use client';

import { useEffect } from 'react';
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-950 p-8 text-center text-white">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-gray-400">
          A critical error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-gray-500">ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-gray-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
