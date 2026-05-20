import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Services Blog | Tips, Guides & Emergency Advice | Fixit 24/7',
  description: 'Expert advice for Australian homeowners — emergency tips, tradie guides, seasonal maintenance, and pricing guides from Fixit 24/7.',
};

const ARTICLES = [
  { slug: 'burst-pipe-emergency', title: 'What to Do When a Pipe Bursts at 2am', category: 'Emergency', readTime: '4 min', excerpt: 'A burst pipe can cause thousands in damage in minutes. Here\'s exactly what to do before the plumber arrives.' },
  { slug: 'electrical-safety', title: '8 Electrical Warning Signs You Should Never Ignore', category: 'Safety', readTime: '5 min', excerpt: 'From flickering lights to burning smells — these signs mean you need an electrician immediately.' },
  { slug: 'how-to-choose-a-tradie', title: 'How to Choose a Trusted Tradie in Australia', category: 'Guide', readTime: '6 min', excerpt: 'Licences, insurance, reviews — everything you need to know before letting someone into your home.' },
  { slug: 'lockout-guide', title: 'Locked Out of Your Home? Do This First', category: 'Emergency', readTime: '3 min', excerpt: 'Before you break a window, here\'s how to handle a home lockout safely and affordably.' },
  { slug: 'hvac-maintenance', title: 'When to Service Your Air Conditioner (Australian Guide)', category: 'Maintenance', readTime: '5 min', excerpt: 'The best time to service your HVAC unit — and what happens if you skip it.' },
  { slug: 'roof-leak-emergency', title: 'Roof Leak in a Storm? Here\'s What to Do Right Now', category: 'Emergency', readTime: '4 min', excerpt: 'Immediate steps to protect your home and belongings while waiting for a roofer.' },
  { slug: 'tradie-pricing-guide', title: 'How Much Do Tradies Cost in Australia? (2024 Guide)', category: 'Pricing', readTime: '7 min', excerpt: 'Average rates for plumbers, electricians, locksmiths and more — by city and job type.' },
  { slug: 'before-tradie-arrives', title: '7 Things to Do Before Your Tradie Arrives', category: 'Guide', readTime: '3 min', excerpt: 'Prepare properly and save time (and money) when your tradie shows up.' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Emergency: 'bg-red-900/40 text-brand-400',
  Safety: 'bg-orange-900/40 text-orange-400',
  Guide: 'bg-brand-500/20 text-brand-400',
  Maintenance: 'bg-green-900/40 text-green-400',
  Pricing: 'bg-purple-900/40 text-purple-400',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-[#0a0a0a] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-extrabold">Home Services Blog</h1>
          <p className="mt-3 text-lg text-gray-400">Expert advice for Australian homeowners. Emergency tips, guides, and pricing.</p>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="group rounded-2xl border border-white/8 bg-white/4 p-6 hover:border-brand-400/40 hover:shadow-md transition-all">
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[article.category] ?? 'bg-white/8 text-gray-400'}`}>{article.category}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{article.readTime}</span>
              </div>
              <h2 className="mb-2 font-bold text-white group-hover:text-brand-400 transition-colors leading-snug">{article.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{article.excerpt}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400">Read more <ChevronRight size={14} /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
