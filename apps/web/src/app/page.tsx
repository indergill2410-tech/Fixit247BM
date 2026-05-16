import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@fixit247/ui';

export const metadata: Metadata = {
  title: 'Fixit247 | Emergency Trades Australia',
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 px-4 py-24 text-center text-white">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            🇦🇺 Australia&rsquo;s #1 Emergency Trade Platform
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Emergency Trades,<br />
            <span className="text-brand-300">24/7 On Demand</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-100 sm:text-xl">
            Connect with verified, licenced tradies for urgent plumbing, electrical, HVAC, and more.
            Fast response. Guaranteed quality. Secure payments.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="xl" variant="emergency">
              <Link href="/register?role=customer">Get Help Now</Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/register?role=tradie">Join as a Tradie</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Why Choose Fixit247?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border border-border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
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
    icon: '⭐',
    title: 'Quality Guaranteed',
    description: 'Every job backed by our satisfaction guarantee and transparent review system.',
  },
  {
    icon: '📍',
    title: 'Local Experts',
    description: 'Find skilled tradies in your suburb with the tools and expertise for your specific job.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Matching',
    description: 'Smart matching technology connects you with the best tradie for your specific problem.',
  },
];
