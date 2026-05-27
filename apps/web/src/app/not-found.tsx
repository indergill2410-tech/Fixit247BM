import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E] p-4">
      <div className="w-full max-w-lg text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/8 blur-[100px]" />

        <div className="relative">
          <p className="text-8xl font-black text-brand-500/20 select-none">404</p>
          <div className="-mt-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-3xl ring-1 ring-brand-500/30">
              🔧
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-sm text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/jobs/new"
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
          >
            Post a job
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
