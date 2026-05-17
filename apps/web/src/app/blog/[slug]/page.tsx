import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Clock, Shield } from 'lucide-react';

const ARTICLES: Record<string, { title: string; category: string; readTime: string; content: string; metaDescription: string }> = {
  'burst-pipe-emergency': {
    title: 'What to Do When a Pipe Bursts at 2am',
    category: 'Emergency',
    readTime: '4 min',
    metaDescription: 'A burst pipe emergency guide for Australian homeowners. Step-by-step instructions to minimise damage before your plumber arrives.',
    content: `## Stay Calm and Act Fast

A burst pipe is one of the most common home emergencies in Australia. Water damage can escalate quickly, but there are steps you can take right now to minimise the damage.

## Step 1: Turn Off Your Water Mains

Your first priority is to stop the water flow. Find your main water shutoff valve — usually located:
- Near the water meter (often at the front of the property)
- Under the kitchen sink
- In the garage or utility room

Turn it clockwise until it stops.

## Step 2: Turn Off Your Hot Water System

If the burst is near your hot water system, turn off the power or gas supply to prevent it from running dry and overheating.

## Step 3: Open Your Taps

Open all the cold taps in your home to drain the remaining water from the pipes. This reduces pressure and minimises further flooding.

## Step 4: Contain the Water

Use towels, buckets, and any waterproof containers to collect water and protect your flooring and belongings. If water is near electrical outlets, **do not enter that area** — switch off power at the breaker first.

## Step 5: Document the Damage

Take photos and video of the damage for your insurance claim before cleanup begins.

## Step 6: Call an Emergency Plumber

This is not a job for DIY. A burst pipe requires a licensed plumber immediately. On Fixit 24/7, you can have a verified local plumber dispatched within 60 minutes — 24/7.

## What NOT to Do

- Don't attempt to repair the pipe yourself
- Don't use the toilet or other water fixtures until the plumber arrives
- Don't ignore small leaks — they escalate fast

## Prevention Tips

- Have your pipes inspected annually
- Insulate exposed pipes before winter
- Know where your water shutoff is before an emergency happens`,
  },
  'electrical-safety': {
    title: '8 Electrical Warning Signs You Should Never Ignore',
    category: 'Safety',
    readTime: '5 min',
    metaDescription: '8 electrical warning signs Australian homeowners must not ignore. When to call an emergency electrician immediately.',
    content: `## When Electricity Goes Wrong

Electrical faults are responsible for thousands of house fires in Australia each year. Many are preventable if warning signs are spotted early.

## 1. Flickering or Dimming Lights

Occasional flickering is normal when large appliances start up. Persistent flickering suggests a loose connection, overloaded circuit, or failing component — all requiring professional attention.

## 2. Frequently Tripping Circuit Breakers

Circuit breakers trip to protect you. If yours trips repeatedly, your circuits are overloaded or there's a fault in your wiring.

## 3. Burning Smell or Scorch Marks

Any burning smell near outlets, switches, or your switchboard is a serious warning sign. Turn off the power at the breaker and call an electrician immediately.

## 4. Buzzing or Crackling Sounds

Electricity should be silent. Buzzing from outlets or your switchboard indicates arcing — a fire hazard that must be addressed immediately.

## 5. Outlets That Are Warm or Hot to Touch

Outlets should never be warm. Hot outlets indicate dangerous wiring issues or overloading.

## 6. Sparking When Plugging In

Occasional minor sparks can be normal. Persistent sparking, or large sparks with a pop sound, indicate a serious fault.

## 7. Outlets with No Power

Dead outlets can indicate tripped GFCI outlets, blown fuses, or broken wiring. Don't ignore them.

## 8. Outdated Wiring

If your home was built before 1980, it may have aluminium wiring or other outdated systems that are fire risks. Have it inspected.

## When to Call an Emergency Electrician

Call immediately if you experience burning smells, sparking, or any electrical issue near water. These are life-threatening emergencies.`,
  },
};

// Generate static entries for other slugs with generic content
function getArticle(slug: string) {
  return ARTICLES[slug] ?? null;
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
    if (block.startsWith('## ')) return { type: 'h2', text: block.slice(3) };
    if (block.startsWith('- ')) return { type: 'ul', items: block.split('\n').map((l) => l.slice(2)) };
    return { type: 'p', text: block };
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
            if (block.type === 'ul') return <ul key={i} className="mb-4 space-y-1 pl-4">{(block as any).items?.map((item: string, j: number) => <li key={j} className="text-gray-400 text-sm list-disc">{item}</li>)}</ul>;
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
