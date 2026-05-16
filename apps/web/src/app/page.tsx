import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@fixit247/ui';
import { SocialProofBar, TrustStatsBar } from '@/components/features/growth/social-proof-bar';
import { RecentActivityFeed } from '@/components/features/growth/recent-activity-feed';

export const metadata: Metadata = {
  title: 'Fixit247 | Emergency Trades Australia',
};

const TRADE_CATEGORIES = [
  { emoji: '🔧', label: 'Plumber', slug: 'plumbing' },
  { emoji: '⚡', label: 'Electrician', slug: 'electrical' },
  { emoji: '❄️', label: 'HVAC', slug: 'hvac' },
  { emoji: '🔑', label: 'Locksmith', slug: 'locksmith' },
  { emoji: '🏠', label: 'Roofer', slug: 'roofing' },
  { emoji: '🐛', label: 'Pest Control', slug: 'pest-control' },
  { emoji: '🪟', label: 'Glazier', slug: 'glazing' },
  { emoji: '🎨', label: 'Painter', slug: 'painting' },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Emergency Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 px-4 py-24 text-center text-white">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            🇦🇺 Australia&rsquo;s #1 Emergency Trade Platform
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Need a Tradie<br />
            <span className="text-red-400">Right Now?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-100 sm:text-xl">
            Connect with verified, licenced tradies for urgent plumbing, electrical, HVAC, and more.
            Fast response. Guaranteed quality. Secure payments.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="xl" variant="emergency">
              <Link href="/emergency">Get Emergency Help Now</Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/register?role=tradie">Join as a Tradie</Link>
            </Button>
          </div>

          {/* Social proof bar */}
          <div className="mt-8 mx-auto max-w-xl">
            <SocialProofBar />
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <TrustStatsBar />
        </div>
      </section>

      {/* Trade Categories */}
      <section className="bg-white py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">What do you need fixed?</h2>
          <p className="mb-8 text-center text-sm text-gray-500">Tap a category for emergency dispatch in Sydney CBD</p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {TRADE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/emergency/${cat.slug}/sydney-cbd`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 p-3 text-center hover:border-brand-400 hover:bg-brand-50 transition-colors"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity + Features grid */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: recent activity */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900">Happening right now</h2>
              <RecentActivityFeed />
            </div>

            {/* Right: features */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900">Why Choose Fixit247?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'Emergency Response',
    description: 'Connect with available tradies in minutes. 24/7 emergency coverage across Australia.',
  },
  {
    icon: '🔒',
    title: 'Verified & Licenced',
    description: 'All tradies are background checked, licenced, and fully insured for your peace of mind.',
  },
  {
    icon: '💳',
    title: 'Secure Escrow Payments',
    description: 'Pay securely with card. Funds held in escrow until the job is completed to your satisfaction.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Matching',
    description: 'Smart matching technology connects you with the best tradie for your specific problem.',
  },
];
