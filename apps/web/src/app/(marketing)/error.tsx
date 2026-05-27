'use client';

import Link from 'next/link';

export default function MarketingError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Please try again or return home.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
