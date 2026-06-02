import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import { BLOG_ARTICLES, CATEGORY_COLORS } from '@/lib/blog/articles';

export const metadata: Metadata = {
  title: 'Home Services Blog | Tips, Guides & Emergency Advice | Fixit 24/7',
  description: 'Expert advice for Australian homeowners — emergency tips, tradie guides, seasonal maintenance, and pricing guides from Fixit 24/7.',
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
          {BLOG_ARTICLES.map((article) => (
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
