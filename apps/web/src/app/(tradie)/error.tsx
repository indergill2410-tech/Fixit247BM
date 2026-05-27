'use client';

export default function TradieError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
      <p className="max-w-sm text-sm text-gray-400">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-gray-500">ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-gray-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Try again
      </button>
    </div>
  );
}
