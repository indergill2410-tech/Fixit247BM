'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/fixit-plus', label: '+ Plus' },
  { href: '/join-as-tradie', label: 'For Tradies' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
] as const;

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav row */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#111111]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-base font-extrabold text-white" onClick={() => setOpen(false)}>
            <span className="text-brand-400">🔑</span>
            Fixit <span className="text-brand-400">24/7</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-white/6 hover:text-white ${
                  pathname === href ? 'text-white' : 'text-gray-400'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: auth + hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-brand-400 px-4 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-300"
            >
              Get started
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="ml-1 rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/8 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-72 border-l border-white/8 bg-[#111111] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-base font-extrabold text-white" onClick={() => setOpen(false)}>
                <span className="text-brand-400">🔑</span>
                Fixit <span className="text-brand-400">24/7</span>
              </Link>
              <button onClick={() => setOpen(false)} className="rounded-xl p-1.5 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/6 hover:text-white ${
                    pathname === href ? 'bg-white/6 text-white' : 'text-gray-400'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full rounded-xl border border-white/15 py-3 text-center text-sm font-medium text-white hover:bg-white/8 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="w-full rounded-xl bg-brand-400 py-3 text-center text-sm font-bold text-gray-900 hover:bg-brand-300 transition-colors"
              >
                Create account
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-brand-500/25 bg-brand-500/8 p-4">
              <p className="text-xs font-semibold text-brand-400">Emergency?</p>
              <Link
                href="/emergency"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-xl bg-brand-500 py-2.5 text-center text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
              >
                Dispatch a tradie now →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
