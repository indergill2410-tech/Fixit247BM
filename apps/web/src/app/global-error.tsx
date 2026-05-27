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
      <body className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-4xl ring-1 ring-red-500/30">
              ⚠️
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mt-3 text-sm text-gray-400">
            A critical error occurred. Our team has been notified.
            {error.digest && (
              <span className="mt-1 block text-xs text-gray-600">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
