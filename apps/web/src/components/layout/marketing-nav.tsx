'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X } from 'lucide-react';

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
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 12); };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Main nav bar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/[0.07] bg-[#0a0a0a]/95 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[15px] font-extrabold text-white transition-opacity hover:opacity-80"
            onClick={() => { setOpen(false); }}
          >
            <span className="text-brand-400">🔑</span>
            Fixit <span className="text-brand-400">24/7</span>
          </Link>

          {/* Desktop center links */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-white/[0.06] text-white'
                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Emergency + auth + hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/emergency"
              className="hidden items-center gap-1.5 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-3.5 py-2 text-xs font-bold text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/[0.12] sm:inline-flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
              </span>
              Emergency
            </Link>

            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white lg:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="hidden rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-gray-900 transition-all hover:bg-brand-400 sm:inline-block"
            >
              Get started
            </Link>
            <button
              onClick={() => { setOpen((v) => !v); }}
              className="ml-1 rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => { setOpen(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 flex h-full w-[min(320px,90vw)] flex-col border-l border-white/[0.07] bg-[#0d0d0d] p-6 shadow-2xl"
            onClick={(e) => { e.stopPropagation(); }}
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-[15px] font-extrabold text-white"
                onClick={() => { setOpen(false); }}
              >
                <span className="text-brand-400">🔑</span>
                Fixit <span className="text-brand-400">24/7</span>
              </Link>
              <button
                onClick={() => { setOpen(false); }}
                className="rounded-xl p-1.5 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => { setOpen(false); }}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'bg-white/[0.07] text-white'
                      : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="mt-6 flex flex-col gap-2.5 border-t border-white/[0.07] pt-6">
              <Link
                href="/login"
                onClick={() => { setOpen(false); }}
                className="w-full rounded-xl border border-white/12 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => { setOpen(false); }}
                className="w-full rounded-xl bg-brand-500 py-3 text-center text-sm font-bold text-gray-900 transition-colors hover:bg-brand-400"
              >
                Create account
              </Link>
            </div>

            {/* Emergency CTA */}
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                </span>
                <p className="text-xs font-bold text-red-400">Emergency?</p>
              </div>
              <p className="mb-3 text-xs text-gray-600">Tradies available right now</p>
              <Link
                href="/emergency"
                onClick={() => { setOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-center text-sm font-bold text-white transition-all hover:bg-red-400 active:scale-[0.98]"
              >
                <Phone size={14} />
                Dispatch a tradie now
              </Link>
            </div>

            {/* Bottom spacer for mobile safe area */}
            <div className="flex-1" />
            <p className="text-center text-[10px] text-gray-700">
              Available 24/7 across Australia
            </p>
          </div>
        </div>
      )}
    </>
  );
}
