import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Shield, Star, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Fixit 24/7 | Australia\'s Emergency Trade Platform',
  description: 'Fixit 24/7 was built to solve one problem: Australians couldn\'t get reliable tradies in an emergency. We fixed that.',
};

const STATS = [
  { value: '50,000+', label: 'Jobs completed' },
  { value: '4,800+', label: 'Verified tradies' },
  { value: '28 min', label: 'Avg response time' },
  { value: '4.8★', label: 'Customer rating' },
];

const VALUES = [
  { icon: <Zap size={22} />, title: 'Speed over everything', desc: 'When something breaks at 2am, you don\'t have time to wait. We built our entire platform around getting help fast.' },
  { icon: <Shield size={22} />, title: 'Trust is non-negotiable', desc: 'Every tradie is background-checked, licence-verified, and insured before they take a single job on Fixit 24/7.' },
  { icon: <Star size={22} />, title: 'Quality that shows', desc: 'Our review system and escrow payments ensure tradies are incentivised to do great work, every time.' },
  { icon: <Users size={22} />, title: 'Fair for tradies too', desc: 'Tradies keep more of what they earn. No hidden commission. We charge a flat credit system so the best tradies stick around.' },
];

const TEAM = [
  { name: 'Inderpreet Gill', role: 'Founder & CEO', avatar: 'IG' },
  { name: 'Operations Team', role: 'Tradie Vetting & Support', avatar: 'OT' },
  { name: 'Product Team', role: 'Platform & AI', avatar: 'PT' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#111111] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/8 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-1.5 text-sm font-medium text-brand-300 ring-1 ring-white/10">
            🔑 Our story
          </span>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl">
            We built what<br />
            <span className="text-brand-400">Australia needed.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Fixit 24/7 was born out of a simple frustration: when something breaks at home, Australians had nowhere to turn quickly. We built the platform that fixes that — connecting homeowners with verified, available tradies in under 30 minutes, 24 hours a day.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/8 bg-[#0f0f0f] py-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-400">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-400">Our mission</p>
              <h2 className="text-3xl font-extrabold">
                Every Australian home,<br />
                <span className="text-brand-400">protected 24/7.</span>
              </h2>
              <p className="mt-5 text-gray-400 leading-relaxed">
                We believe no one should be left stranded with a burst pipe, a broken lock, or a dead heater because they can't find a reliable tradie. Fixit 24/7 exists to eliminate that stress — permanently.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                We're building Australia's most trusted trade marketplace — where homeowners get help fast, and tradies get steady, quality work with fair pay.
              </p>
            </div>
            <div className="rounded-3xl border border-brand-500/25 bg-brand-500/8 p-8">
              <p className="text-4xl font-extrabold text-brand-400 mb-2">&ldquo;</p>
              <p className="text-lg text-white leading-relaxed">
                We wanted to build the platform we wished existed — one that respects both the homeowner's urgency and the tradie's time.
              </p>
              <p className="mt-4 text-sm text-gray-500">— Fixit 24/7 Founding Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">What we stand for</p>
            <h2 className="text-3xl font-extrabold">Our values</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">The team</p>
          <h2 className="text-3xl font-extrabold mb-10">Built by Australians, for Australians</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-lg font-bold text-brand-400">
                  {m.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-extrabold">Join us</h2>
          <p className="mt-4 text-gray-500">Whether you need a tradie or you are one — Fixit 24/7 is for you.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/jobs/new" className="rounded-xl bg-brand-400 px-7 py-3.5 text-sm font-bold text-gray-900 hover:bg-brand-300 transition-colors">
              Post a job — it&apos;s free
            </Link>
            <Link href="/join-as-tradie" className="rounded-xl border border-white/15 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/8 transition-colors">
              Join as a tradie
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
