import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Tradie Tips, Home Maintenance & Emergency Guides | Fixit 24/7',
  description: 'Expert advice on home maintenance, emergency repairs, finding trusted tradies and protecting your home. From the Fixit 24/7 team.',
};

const POSTS = [
  { slug: 'what-to-do-burst-pipe', title: "Burst pipe at 2am? Here's exactly what to do", excerpt: 'Water flooding your home is terrifying. We walk you through the immediate steps to minimise damage and get help fast.', category: 'Emergency Guide', readTime: '4 min read', date: 'May 2025' },
  { slug: 'how-to-find-trusted-tradie', title: 'How to find a trusted tradie in Australia (without getting ripped off)', excerpt: 'Licence checks, insurance, reviews — the complete checklist every homeowner should use before hiring anyone.', category: 'Homeowner Tips', readTime: '6 min read', date: 'Apr 2025' },
  { slug: 'escrow-payments-explained', title: "What is escrow payment and why it protects you", excerpt: "Fixit247 holds your money safely until the job is done. Here's how it works and why it's the safest way to pay a tradie.", category: 'How It Works', readTime: '3 min read', date: 'Apr 2025' },
  { slug: 'tradie-subscription-guide', title: 'The complete guide to tradie subscription plans on Fixit247', excerpt: "Free, Professional or Elite — which plan grows your trade business fastest? We break it down with real numbers.", category: 'For Tradies', readTime: '5 min read', date: 'Mar 2025' },
  { slug: 'electrical-emergency-signs', title: '7 electrical warning signs you should never ignore', excerpt: "Flickering lights and burning smells are your home's way of asking for help. A licensed electrician explains what to watch for.", category: 'Emergency Guide', readTime: '5 min read', date: 'Mar 2025' },
  { slug: 'fixit-plus-worth-it', title: 'Is Fixit Plus worth it? We ran the numbers', excerpt: 'One emergency call-out costs $180–$300. Here\'s a real breakdown of when the $49/month plan pays for itself.', category: 'Fixit Plus', readTime: '4 min read', date: 'Feb 2025' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Emergency Guide': 'bg-red-50 text-red-700',
  'Homeowner Tips': 'bg-blue-50 text-blue-700',
  'How It Works': 'bg-brand-500/10 text-brand-700',
  'For Tradies': 'bg-amber-50 text-amber-700',
  'Fixit Plus': 'bg-purple-50 text-purple-700',
};

export default function BlogPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border bg-background-alt px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-label mb-3">Fixit 24/7 Blog</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Home repair,<br/><span className="text-brand-600">explained simply.</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground-muted">Expert guides on emergencies, finding tradies, and protecting your biggest investment — your home.</p>
        </div>
      </section>
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm-warm transition-all hover:border-brand-500/30 hover:shadow-card-warm-hover">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'}`}>{post.category}</span>
                  <span className="text-xs text-foreground-subtle">{post.readTime}</span>
                </div>
                <h2 className="mb-2 flex-1 text-sm font-bold leading-snug text-foreground group-hover:text-brand-600">{post.title}</h2>
                <p className="mb-4 text-xs leading-relaxed text-foreground-muted line-clamp-3">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-foreground-subtle">{post.date}</span>
                  <span className="text-xs font-semibold text-brand-600 group-hover:underline">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
