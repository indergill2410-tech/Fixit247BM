import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Clock, Shield, Star, Zap, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Emergency Trades Australia | 24/7 Dispatch | Fixit 24/7',
  description: 'Get emergency trade help now. Verified plumbers, electricians, locksmiths, HVAC technicians and roofers dispatched in under 60 minutes, 24/7 across Australia.',
  openGraph: {
    title: 'Emergency Trades Australia | 24/7 Dispatch | Fixit 24/7',
    description: 'Get emergency trade help now. Verified tradies dispatched in under 60 minutes, 24/7 across Australia.',
    siteName: 'Fixit 24/7',
    locale: 'en_AU',
    type: 'website',
  },
  alternates: { canonical: 'https://fixit247.com.au/emergency' },
  robots: { index: true, follow: true },
};

const EMERGENCY_TRADES = [
  { slug: 'plumbing', name: 'Plumbing', singular: 'Plumber', emoji: '🔧', examples: 'Burst pipes, blocked drains, hot water failure' },
  { slug: 'electrical', name: 'Electrical', singular: 'Electrician', emoji: '⚡', examples: 'Power outages, sparking outlets, exposed wiring' },
  { slug: 'locksmith', name: 'Locksmith', singular: 'Locksmith', emoji: '🔑', examples: 'Locked out, broken locks, security breach' },
  { slug: 'hvac', name: 'HVAC', singular: 'HVAC Technician', emoji: '❄️', examples: 'AC failure, gas leaks, heating breakdown' },
  { slug: 'roofing', name: 'Roofing', singular: 'Roofer', emoji: '🏠', examples: 'Storm damage, leaking roof, structural damage' },
  { slug: 'glazing', name: 'Glazing', singular: 'Glazier', emoji: '🪟', examples: 'Broken windows, smashed glass, security glazing' },
  { slug: 'pest-control', name: 'Pest Control', singular: 'Pest Controller', emoji: '🐛', examples: 'Termite swarms, rodent infestation, wasp nests' },
  { slug: 'general-maintenance', name: 'General Maintenance', singular: 'Handyman', emoji: '🛠️', examples: 'Urgent repairs, property damage, safety hazards' },
];

const RECENT_SUBURBS = [
  'Sydney CBD', 'Melbourne CBD', 'Brisbane CBD', 'Perth CBD',
  'Parramatta', 'Bondi', 'St Kilda', 'Southbank',
  'Gold Coast', 'Sunshine Coast', 'Fremantle', 'Glenelg',
];

const STATS = [
  { value: '2,847', label: 'Jobs completed this month' },
  { value: '< 60 min', label: 'Average response time' },
  { value: '4.9★', label: 'Customer rating' },
  { value: '24/7', label: 'Always available' },
];

const TRUST_POINTS = [
  { icon: '🔍', title: 'Background Checked', desc: 'Every tradie undergoes a police background check before joining.' },
  { icon: '📜', title: 'Fully Licensed', desc: 'All tradies hold valid Australian trade licences for their profession.' },
  { icon: '🛡️', title: 'Insured', desc: 'Public liability insurance of $20M+ covers every job on the platform.' },
  { icon: '⭐', title: 'Rated & Reviewed', desc: 'Real reviews from verified customers. Average 4.9 out of 5 stars.' },
];

export default function EmergencyHubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-red-600 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="flex h-3 w-3 animate-pulse rounded-full bg-red-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-red-200">Live · Tradies Available Now</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Emergency Trade Help,<br />
            <span className="text-red-200">Available Right Now</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-red-100">
            Verified, licensed tradies dispatched to your door in under 60 minutes.
            Available 24 hours a day, 7 days a week, across Australia.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/post-job?emergency=true"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-xl font-extrabold text-red-600 shadow-xl hover:bg-red-50 transition-colors"
            >
              <Zap size={24} />
              Get Emergency Help Now
            </Link>
            <a
              href="tel:1800348498"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white px-10 py-5 text-xl font-bold text-white hover:bg-red-700 transition-colors"
            >
              <Phone size={24} />
              Call 1800-FIXIT-247
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-red-700/50 p-4 backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-red-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency trade links */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Select Your Emergency Trade
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Find a verified professional for your specific emergency
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {EMERGENCY_TRADES.map((t) => (
              <Link
                key={t.slug}
                href={`/emergency/${t.slug}/sydney-cbd`}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-red-300 hover:bg-red-50 transition-colors group"
              >
                <span className="text-3xl shrink-0">{t.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-red-700">
                    Emergency {t.singular} →
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{t.examples}</p>
                </div>
                <div className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  24/7
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            How Emergency Dispatch Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Describe Your Emergency',
                desc: 'Tell us what\'s happening. Our AI triages the urgency and identifies the right trade for your situation.',
                icon: '📋',
              },
              {
                step: '2',
                title: 'We Notify Local Tradies',
                desc: 'Verified tradies in your area are alerted instantly. The first available professional accepts your job.',
                icon: '📡',
              },
              {
                step: '3',
                title: 'Tradie En Route',
                desc: 'Track your tradie in real-time. Average arrival time across Australian cities: under 60 minutes.',
                icon: '🚗',
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white p-6 shadow-sm text-center">
                <div className="mb-3 text-4xl">{s.icon}</div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-red-600">Step {s.step}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Every Tradie is Verified
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center">
                <div className="mb-3 text-3xl">{p.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Satisfaction Guarantee</p>
                <p className="mt-1 text-sm text-green-700">
                  Your payment is held securely in escrow and only released when you confirm the work is complete and you are satisfied. If something goes wrong, our support team steps in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent suburbs */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Recently Served Suburbs
          </h2>
          <p className="text-center text-gray-500 mb-8">Emergency jobs completed in the last 24 hours</p>
          <div className="flex flex-wrap justify-center gap-3">
            {RECENT_SUBURBS.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700"
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Clock size={18} className="text-red-400" />
            <span className="text-sm font-bold uppercase tracking-widest text-red-400">Don&apos;t Wait</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-4">
            Get Emergency Help in Minutes
          </h2>
          <p className="mb-8 text-gray-400">
            Post your emergency job for free. Our AI dispatch system connects you with the nearest available tradie immediately.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/post-job?emergency=true"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-10 py-5 text-lg font-bold text-white shadow-lg hover:bg-red-700 transition-colors"
            >
              <Zap size={20} />
              Get Help Now — It&apos;s Free to Post
            </Link>
            <a
              href="tel:1800348498"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Phone size={18} />
              <span>or call 1800-FIXIT-247</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
