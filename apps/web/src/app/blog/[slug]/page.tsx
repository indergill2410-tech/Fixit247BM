import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, Shield } from 'lucide-react';
import { BLOG_ARTICLES, getArticle } from '@/lib/blog/articles';

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Fixit 24/7 Blog`,
    description: article.metaDescription,
    openGraph: { title: article.title, description: article.metaDescription, siteName: 'Fixit 24/7' },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Convert basic markdown to HTML (simplified)
  const paragraphs = article.content.split('\n\n').map((block) => {
    if (block.startsWith('## ')) return { type: 'h2' as const, text: block.slice(3) };
    if (block.startsWith('- ')) return { type: 'ul' as const, items: block.split('\n').map((l) => l.slice(2)) };
    return { type: 'p' as const, text: block };
  });

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="mb-8 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200">
          <ChevronLeft size={14} /> Back to blog
        </Link>
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-brand-400/20 px-3 py-1 text-xs font-semibold text-brand-400">{article.category}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={12} />{article.readTime} read</span>
        </div>
        <h1 className="mb-6 text-3xl font-extrabold text-white leading-tight">{article.title}</h1>
        <div className="prose prose-invert max-w-none">
          {paragraphs.map((block, i) => {
            if (block.type === 'h2') return <h2 key={i} className="mt-8 mb-3 text-xl font-bold text-white">{block.text}</h2>;
            if (block.type === 'ul') {
              return <ul key={i} className="mb-4 space-y-1 pl-4">{block.items.map((item, j) => <li key={j} className="text-gray-400 text-sm list-disc">{item}</li>)}</ul>;
            }
            return <p key={i} className="mb-4 text-gray-400 leading-relaxed">{block.text}</p>;
          })}
        </div>
        <div className="mt-10 rounded-2xl bg-white/8 border border-white/8 p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={18} className="text-brand-400" />
            <p className="font-semibold">Need a verified tradie right now?</p>
          </div>
          <p className="mb-4 text-sm text-gray-400">Fixit 24/7 dispatches licensed, insured professionals in under 60 minutes.</p>
          <Link href="/emergency" className="inline-block rounded-xl bg-brand-400 px-6 py-3 font-bold text-gray-900 hover:bg-brand-300 transition-colors">
            Get Emergency Help Now
          </Link>
        </div>
      </div>
    </div>
  );
}
