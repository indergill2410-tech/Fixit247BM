'use client';

import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <p className="text-sm font-semibold text-amber-700">Admin console unavailable</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">We could not load this view</h1>
        <p className="mt-3 text-sm text-gray-600">
          {error.message || 'The console hit a temporary problem. Please retry or return to the dashboard.'}
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-gray-400">ID: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
