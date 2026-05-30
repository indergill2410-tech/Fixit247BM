import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, ShieldCheck, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Find a Tradie Near You | Fixit 24/7',
  description: 'Find verified local tradies for plumbing, electrical, locksmith, roofing, HVAC, cleaning, maintenance, and emergency repairs.',
};

const TRADES = [
  { slug: 'plumbing', name: 'Plumbers', desc: 'Leaks, blocked drains, burst pipes, hot water' },
  { slug: 'electrical', name: 'Electricians', desc: 'Power faults, lighting, switchboards, safety checks' },
  { slug: 'locksmith', name: 'Locksmiths', desc: 'Lockouts, rekeys, lock repairs, urgent access' },
  { slug: 'hvac', name: 'HVAC technicians', desc: 'Heating, cooling, servicing, urgent repairs' },
  { slug: 'roofing', name: 'Roofers', desc: 'Leaks, storm damage, gutters, roof repairs' },
  { slug: 'general-maintenance', name: 'Handymen', desc: 'Repairs, installs, assembly, property upkeep' },
  { slug: 'pest-control', name: 'Pest control', desc: 'Termites, rodents, insects, prevention' },
  { slug: 'cleaning', name: 'Cleaners', desc: 'Home, deep, move-out, and urgent cleans' },
];

const AREAS = [
  { label: 'Sydney CBD', href: '/suburb/nsw/sydney-cbd' },
  { label: 'Bondi', href: '/suburb/nsw/bondi' },
  { label: 'Parramatta', href: '/suburb/nsw/parramatta' },
  { label: 'Melbourne CBD', href: '/suburb/vic/melbourne-cbd' },
  { label: 'Brisbane CBD', href: '/suburb/qld/brisbane-cbd' },
  { label: 'Perth CBD', href: '/suburb/wa/perth-cbd' },
];

export default function FindATradiePage() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-400">Find a tradie</p>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">Verified local tradies, ready when you need them.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
              Browse popular trades and service areas, or post a job to get matched with available professionals near you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-400 px-7 py-3.5 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-300">
                Post a job <ArrowRight size={16} />
              </Link>
              <Link href="/emergency" className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-7 py-3.5 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/15">
                Emergency dispatch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#0f0f0f] px-4 py-10">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: 'Licence and insurance checks' },
            { icon: Clock, label: 'Same-day and emergency availability' },
            { icon: Star, label: 'Ratings, trust scores, and reviews' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                <Icon size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-200">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">Trades</p>
              <h2 className="text-3xl font-extrabold">Popular services</h2>
            </div>
            <Link href="/jobs/new" className="hidden text-sm font-semibold text-brand-300 hover:text-brand-200 sm:inline-flex">
              Need something else?
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRADES.map((trade) => (
              <Link
                key={trade.slug}
                href={`/trade/${trade.slug}/sydney-cbd`}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]"
              >
                <h3 className="font-bold">{trade.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-gray-500">{trade.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-300">
                  View options <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">Areas</p>
            <h2 className="text-3xl font-extrabold">Browse by suburb</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 transition-colors hover:border-brand-400/40 hover:bg-white/[0.06]"
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <MapPin size={16} className="text-brand-400" />
                  {area.label}
                </span>
                <ArrowRight size={16} className="text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
