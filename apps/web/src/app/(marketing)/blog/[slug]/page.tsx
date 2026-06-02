import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const POSTS: Record<string, { title: string; category: string; date: string; readTime: string; content: string }> = {
  'what-to-do-burst-pipe': {
    title: "Burst pipe at 2am? Here's exactly what to do",
    category: 'Emergency Guide', date: 'May 2025', readTime: '4 min read',
    content: `A burst pipe is one of the most stressful home emergencies you can face — especially at night. Here's what to do in the first 10 minutes.\n\n## Step 1: Turn off your water main\n\nThe water main shutoff is usually in your front yard, garage, or under the kitchen sink. Turn it clockwise until it stops. This is the single most important step to prevent flooding damage.\n\n## Step 2: Turn off electricity in affected areas\n\nIf water is near any power points or your switchboard, trip the circuit breakers for those areas immediately. Water and electricity are a deadly combination.\n\n## Step 3: Document the damage\n\nTake photos and video of everything before cleanup begins. You'll need this for your insurance claim.\n\n## Step 4: Call an emergency plumber\n\nDon't wait until morning. A licensed emergency plumber can be on-site in under 30 minutes through Fixit 24/7. Leaving a burst pipe unattended overnight can cause tens of thousands in water damage.\n\n## Step 5: Start water extraction\n\nUse towels, buckets and a wet/dry vacuum to remove standing water. Open windows to improve airflow and reduce mould risk.\n\n## How much does an emergency plumber cost?\n\nEmergency call-outs typically cost $150–$350 depending on time of day and complexity. With Fixit Plus, emergency plumbing is covered under your flat monthly fee — no surprise bills.`,
  },
  'how-to-find-trusted-tradie': {
    title: 'How to find a trusted tradie in Australia (without getting ripped off)',
    category: 'Homeowner Tips', date: 'Apr 2025', readTime: '6 min read',
    content: `Finding a reliable tradie is one of the biggest pain points for Australian homeowners. Here's the complete checklist.\n\n## 1. Check their licence\n\nEvery licensed tradesperson in Australia has a public registration number. For electricians and plumbers, this is mandatory. Search your state's fair trading website to verify before anyone starts work.\n\n## 2. Verify insurance\n\nAt minimum, ask for proof of $5M public liability insurance. Without it, you could be liable if something goes wrong on your property.\n\n## 3. Read recent reviews\n\nDon't just look at star ratings — read the actual text. Look for consistent themes about punctuality, communication and quality. Reviews on platforms like Fixit247 are verified against completed jobs.\n\n## 4. Get three quotes\n\nFor any job over $500, always get at least three quotes. This protects against price gouging and gives you a market reference.\n\n## 5. Never pay full upfront\n\nReputable tradies don't ask for 100% payment before work begins. A 20–30% deposit is standard. The balance should be paid on completion — ideally through a secure escrow system.\n\n## Why Fixit247 is safer\n\nEvery tradie on Fixit247 has been licence-checked, police-cleared and insured. Your payment is held in escrow until you confirm you're satisfied. Disputes are handled by our resolution team.`,
  },
  'escrow-payments-explained': {
    title: 'What is escrow payment and why it protects you',
    category: 'How It Works', date: 'Apr 2025', readTime: '3 min read',
    content: `Escrow sounds complicated but the concept is simple — and it's the safest way to pay for any trade work.\n\n## What is escrow?\n\nEscrow is when a neutral third party holds your money until both sides of a transaction are satisfied. On Fixit247, we hold your payment securely after you pay, and only release it to the tradie once you confirm the job is done to your satisfaction.\n\n## Why this protects you\n\n- The tradie knows they'll be paid promptly on completion — no chasing\n- You know your money is safe — no risk of paying for work that isn't completed\n- If there's a dispute, our resolution team can review the job and mediate\n\n## How it works on Fixit247\n\n1. You post a job and accept a quote\n2. You pay by card — funds go to our secure escrow account (powered by Stripe)\n3. The tradie completes the work\n4. You confirm completion in the app\n5. Payment is released to the tradie within 24 hours\n\nIf you're not satisfied, you can open a dispute before releasing funds. Our team reviews the job and works with both parties to reach a fair outcome.`,
  },
  'tradie-subscription-guide': {
    title: 'The complete guide to tradie subscription plans on Fixit247',
    category: 'For Tradies', date: 'Mar 2025', readTime: '5 min read',
    content: `Choosing the right plan on Fixit247 directly impacts how many leads you receive and how fast you grow. Here's a breakdown.\n\n## Free Plan — $0/month\n\nPerfect for tradies just starting out. You get basic profile visibility and can respond to jobs posted in your area, but at lower priority in the matching algorithm.\n\n**Best for:** Tradies testing the platform, part-time operators, trades starting from scratch.\n\n## Professional Plan — $99/month\n\nThe most popular plan. You get priority matching, appear higher in search results, and receive job alert notifications before free-tier tradies.\n\nIncludes: Priority matching, profile badge, direct message with customers, job insights dashboard.\n\n**Best for:** Full-time tradies looking for consistent lead flow.\n\n## Elite Plan — $199/month\n\nMaximum visibility. You appear at the top of all relevant searches, get emergency job alerts first, and receive dedicated account support.\n\nIncludes: Everything in Professional, plus emergency priority dispatch, featured profile, and monthly performance reports.\n\n**Best for:** Trade businesses with 2+ staff, high-volume operators.\n\n## First 6 months free credits\n\nEvery new tradie gets $111 AUD in free job credits each month for their first six months — regardless of plan. This gives you real earning potential before you commit to a paid subscription.`,
  },
  'electrical-emergency-signs': {
    title: '7 electrical warning signs you should never ignore',
    category: 'Emergency Guide', date: 'Mar 2025', readTime: '5 min read',
    content: `Your home's electrical system gives warning signs before it fails. Ignoring them can be dangerous — and expensive.\n\n## 1. Flickering or dimming lights\n\nOccasional flickering when an appliance kicks on is normal. Persistent flickering — especially across multiple rooms — suggests a loose connection or overloaded circuit.\n\n## 2. Burning smell near outlets or switches\n\nThis is an immediate red flag. A burning smell from an outlet suggests arcing — where electricity is jumping between loose wires. This is a fire hazard. Turn off the circuit and call an electrician immediately.\n\n## 3. Circuit breakers that keep tripping\n\nCircuit breakers trip to protect you. If the same breaker trips repeatedly, you have either an overloaded circuit or a fault somewhere in the wiring.\n\n## 4. Hot power points or switch plates\n\nSwitch plates should be room temperature. If they're warm to the touch (and you haven't been running high-draw appliances), there's likely a wiring problem.\n\n## 5. Buzzing or humming sounds\n\nElectricity should be silent. Buzzing from a switch, outlet or your switchboard indicates loose wiring or a failing component.\n\n## 6. Outlets with scorch marks\n\nBlack marks around an outlet are evidence of past arcing. Even if the outlet seems to be working, have it replaced by a licensed electrician.\n\n## 7. Your home is over 25 years old and hasn't been rewired\n\nOlder wiring standards (especially pre-1990 aluminium wiring) don't meet modern safety requirements. If your home has never had an electrical safety inspection, book one.`,
  },
  'fixit-plus-worth-it': {
    title: 'Is Fixit Plus worth it? We ran the numbers',
    category: 'Fixit Plus', date: 'Feb 2025', readTime: '4 min read',
    content: `Fixit Plus costs $49/month for the Total plan. Whether it's worth it depends entirely on how likely you are to need emergency trade work.\n\n## The maths\n\nThe average emergency call-out in Australia costs:\n- Emergency plumber: $180–$350\n- Emergency electrician: $200–$400\n- Emergency locksmith: $120–$250\n- Emergency HVAC: $150–$300\n\nFixit Plus Total at $49/month = $588/year.\n\nIf you have **just one** emergency call-out per year, you've already broken even.\n\n## Who it's worth it for\n\n**Definitely worth it:**\n- Homeowners with older properties (more likely to have plumbing/electrical issues)\n- Families with young children (accidents happen more)\n- People with older roofing or drainage systems\n- Anyone who's had an emergency in the past 2 years\n\n**Probably not worth it:**\n- Renters (landlords are responsible for most repairs)\n- People in brand-new properties under builder's warranty\n- Those with comprehensive home insurance that covers trade emergencies\n\n## The real value: peace of mind\n\nBeyond the maths, Fixit Plus means you never have to make a stressed 2am call wondering if you can afford a plumber. One monthly fee, unlimited call-outs, zero bill anxiety.\n\nStart with a 14-day free trial — no credit card required to begin.`,
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: 'Not Found' };
  return { title: `${post.title} | Fixit 24/7 Blog`, description: post.content.slice(0, 160) };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const paragraphs = post.content.split('\n\n');

  return (
    <main className="bg-background">
      <section className="border-b border-border bg-background-alt px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground">← Back to blog</Link>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-700">{post.category}</span>
            <span className="text-xs text-foreground-subtle">{post.date} · {post.readTime}</span>
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
        </div>
      </section>
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <article className="prose prose-sm max-w-none text-foreground-secondary">
            {paragraphs.map((para, i) => {
              if (para.startsWith('## ')) return <h2 key={i} className="mt-8 mb-3 text-lg font-bold text-foreground">{para.slice(3)}</h2>;
              if (para.startsWith('**') && para.endsWith('**')) return <p key={i} className="font-semibold text-foreground">{para.slice(2, -2)}</p>;
              return <p key={i} className="mb-4 leading-relaxed">{para}</p>;
            })}
          </article>
          <div className="mt-12 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Need help right now?</p>
            <p className="text-xs text-foreground-muted mb-4">Verified tradies available 24/7 across Australia.</p>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors">Post a job — it&apos;s free →</Link>
          </div>
          <div className="mt-8 border-t border-border pt-8">
            <p className="text-sm font-semibold text-foreground mb-4">More articles</p>
            <Link href="/blog" className="text-sm text-brand-600 hover:underline">← Back to all articles</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
