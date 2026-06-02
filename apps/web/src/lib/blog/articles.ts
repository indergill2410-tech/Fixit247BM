// Single source of truth for blog content.
// Both the /blog listing and /blog/[slug] detail pages read from this list,
// so the two can never drift out of sync (which previously left listed
// articles pointing at slugs with no content).

export interface BlogArticle {
  slug: string;
  title: string;
  category: 'Emergency' | 'Safety' | 'Guide' | 'Maintenance' | 'Pricing';
  readTime: string;
  excerpt: string;
  metaDescription: string;
  /** Lightweight markdown: `## headings`, `- bullet` lists, blank-line paragraphs. */
  content: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'burst-pipe-emergency',
    title: 'What to Do When a Pipe Bursts at 2am',
    category: 'Emergency',
    readTime: '4 min',
    excerpt:
      "A burst pipe can cause thousands in damage in minutes. Here's exactly what to do before the plumber arrives.",
    metaDescription:
      'A burst pipe emergency guide for Australian homeowners. Step-by-step instructions to minimise damage before your plumber arrives.',
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
  {
    slug: 'electrical-safety',
    title: '8 Electrical Warning Signs You Should Never Ignore',
    category: 'Safety',
    readTime: '5 min',
    excerpt:
      'From flickering lights to burning smells — these signs mean you need an electrician immediately.',
    metaDescription:
      '8 electrical warning signs Australian homeowners must not ignore. When to call an emergency electrician immediately.',
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
  {
    slug: 'how-to-choose-a-tradie',
    title: 'How to Choose a Trusted Tradie in Australia',
    category: 'Guide',
    readTime: '6 min',
    excerpt:
      'Licences, insurance, reviews — everything you need to know before letting someone into your home.',
    metaDescription:
      'How to choose a trusted, licensed tradie in Australia. Checks for licences, insurance, quotes and reviews before you hire.',
    content: `## Why Choosing the Right Tradie Matters

Letting a stranger into your home to perform skilled work is a big decision. The right tradie saves you money and stress; the wrong one can leave you with shoddy work, safety hazards, and no recourse. Here's how to choose well.

## Check Their Licence

Most trades in Australia are licensed and regulated at the state level. Before hiring:
- Ask for their licence number
- Verify it on your state regulator's website (for example, VBA in Victoria, NSW Fair Trading, QBCC in Queensland)
- Confirm the licence covers the specific work you need

Unlicensed work can void your home insurance and is illegal for many jobs.

## Confirm They're Insured

A reputable tradie carries public liability insurance, and for many trades, professional indemnity. This protects you if something goes wrong. Always ask to see a current certificate of currency.

## Read Reviews — Carefully

Look for patterns, not just star ratings:
- Do reviewers mention punctuality, cleanliness, and clear pricing?
- How does the tradie respond to negative reviews?
- Are reviews recent and specific?

On Fixit 24/7, every tradie is identity-verified and licence-checked before they can accept jobs, and reviews come from completed, paid jobs only.

## Get a Written Quote

Never rely on a verbal estimate for anything beyond a minor job. A proper quote should include:
- A breakdown of labour and materials
- Whether it's a fixed price or an estimate
- Call-out fees and after-hours rates
- Payment terms

## Watch for Red Flags

- Demands for large cash deposits upfront
- No written quote or contract
- Pressure to decide immediately
- No fixed business address or ABN
- A price that seems too good to be true

## Trust Your Instincts

If a tradie is evasive about licensing, insurance, or pricing, walk away. A professional has nothing to hide.`,
  },
  {
    slug: 'lockout-guide',
    title: 'Locked Out of Your Home? Do This First',
    category: 'Emergency',
    readTime: '3 min',
    excerpt:
      "Before you break a window, here's how to handle a home lockout safely and affordably.",
    metaDescription:
      'Locked out of your home in Australia? A calm step-by-step guide to getting back in safely without causing damage.',
    content: `## Don't Panic — and Don't Break a Window

A lockout feels urgent, but breaking a window or forcing a door usually costs far more than a locksmith call-out. Take a breath and work through these steps.

## Step 1: Check Every Door and Window

It sounds obvious, but check every entry point. A back door, garage door, or ground-floor window is often unlocked.

## Step 2: Contact Anyone with a Spare Key

A partner, housemate, neighbour, or family member with a spare key is your fastest and cheapest solution.

## Step 3: Check Your Real Estate Agent or Landlord

If you rent, your agent or landlord may hold a spare key during business hours.

## Step 4: Call a Licensed Locksmith

If you can't get in, call a professional locksmith. A good locksmith can usually open a standard residential lock without damaging it. On Fixit 24/7, verified locksmiths are available 24/7 and give upfront pricing before they start.

## What a Locksmith Will Ask

Be ready to prove you live there — they'll typically ask for ID and may ask a few security questions. This protects you and your home.

## Avoid These Mistakes

- Don't try to pick the lock yourself with online "tricks" — you'll often jam it
- Don't force a uPVC or aluminium door — the mechanism is easily damaged
- Don't use an unlicensed "cheap" locksmith found through a fake local listing

## Prevent Future Lockouts

- Leave a spare key with someone you trust
- Consider a keypad or smart lock
- Keep a locksmith's number saved before you need it`,
  },
  {
    slug: 'hvac-maintenance',
    title: 'When to Service Your Air Conditioner (Australian Guide)',
    category: 'Maintenance',
    readTime: '5 min',
    excerpt:
      'The best time to service your HVAC unit — and what happens if you skip it.',
    metaDescription:
      'When to service your air conditioner in Australia, what a service includes, and the cost of skipping regular HVAC maintenance.',
    content: `## Why Regular AC Servicing Pays Off

Australian summers push air conditioners hard. Regular servicing keeps your unit efficient, extends its life, and prevents the dreaded mid-heatwave breakdown when every technician is booked out.

## How Often Should You Service?

- **Split systems:** once a year, ideally in spring before summer
- **Ducted systems:** once a year, with filter cleaning every few months
- **Heavy use or allergy sufferers:** twice a year

## The Best Time to Book

Spring (September–November) is ideal. You beat the summer rush, and your unit is ready before the first heatwave. Booking in peak summer often means long waits and emergency call-out fees.

## What a Service Includes

A proper air conditioner service should cover:
- Cleaning or replacing filters
- Checking refrigerant levels
- Inspecting and cleaning coils
- Testing the thermostat and electrical connections
- Clearing the condensate drain
- Checking for unusual noises or vibration

## Signs Your AC Needs Attention Now

- Weak airflow or warm air
- Strange smells when running
- Unusual noises — rattling, grinding, or hissing
- Water pooling around the unit
- A sudden spike in your power bill

## The Cost of Skipping Maintenance

A neglected unit works harder, uses more power, and fails sooner. A blocked filter alone can cut efficiency by 15% or more. Minor servicing is far cheaper than a compressor replacement or a full system failure.

## DIY vs Professional

You can clean accessible filters yourself, but refrigerant, electrical, and coil work must be done by a licensed technician. In Australia, handling refrigerant requires an ARC licence.`,
  },
  {
    slug: 'roof-leak-emergency',
    title: "Roof Leak in a Storm? Here's What to Do Right Now",
    category: 'Emergency',
    readTime: '4 min',
    excerpt:
      'Immediate steps to protect your home and belongings while waiting for a roofer.',
    metaDescription:
      'Roof leaking in a storm? Emergency steps for Australian homeowners to limit water damage safely before a roofer arrives.',
    content: `## Act Fast to Limit the Damage

A roof leak during a storm can spread water through ceilings, walls, and insulation in minutes. Your goal before help arrives is to contain the water and stay safe.

## Step 1: Protect Yourself First

Never climb onto a wet or storm-battered roof. Most serious roof-leak injuries happen during well-meant DIY in bad weather. All roof work in a storm should wait for a professional.

## Step 2: Contain the Water Inside

- Place buckets or containers under active drips
- Lay towels and plastic sheeting to protect floors and furniture
- Move valuables, electronics, and furniture away from the leak

## Step 3: Relieve a Bulging Ceiling

If water is pooling in a ceiling and causing a bulge, it can collapse suddenly. From a safe position, pierce a small hole at the lowest point with a screwdriver to let water drain into a bucket in a controlled way. Only do this if it's safe to reach.

## Step 4: Switch Off Power if Water Is Near Electrics

If water is near light fittings or wiring, turn off the power to that area at the switchboard.

## Step 5: Document Everything

Photograph the leak and any damage for your insurance claim before you clean up.

## Step 6: Call an Emergency Roofer

A licensed roofer can apply a temporary weatherproof cover and return for a permanent repair once the storm passes. On Fixit 24/7, emergency roofers are available around the clock.

## After the Storm

- Get the full repair done quickly — temporary fixes don't last
- Have your roof inspected for hidden damage
- Check your gutters and downpipes, which often contribute to leaks`,
  },
  {
    slug: 'tradie-pricing-guide',
    title: 'How Much Do Tradies Cost in Australia? (2026 Guide)',
    category: 'Pricing',
    readTime: '7 min',
    excerpt:
      'Average rates for plumbers, electricians, locksmiths and more — by city and job type.',
    metaDescription:
      'A 2026 guide to tradie costs in Australia. Typical hourly rates and call-out fees for plumbers, electricians, locksmiths and more.',
    content: `## What You'll Actually Pay

Tradie pricing in Australia varies by trade, location, time of day, and job complexity. This guide gives you realistic ranges so you can spot a fair quote — and an inflated one.

## How Tradies Charge

Most tradies charge in one of three ways:
- **Call-out fee:** a flat fee just to attend, often covering the first 15–30 minutes
- **Hourly rate:** billed per hour after the call-out
- **Fixed price:** a set quote for a defined job

After-hours, weekend, and emergency work attract premium rates — often 1.5× to 2× standard.

## Typical Hourly Rates

These are general guides for standard hours; emergency and after-hours rates are higher:
- **Plumbers:** $90–$150/hr, call-out $80–$150
- **Electricians:** $90–$140/hr, call-out $80–$130
- **Locksmiths:** call-out $90–$180, often a fixed price per job
- **HVAC technicians:** $90–$140/hr
- **Roofers:** usually quoted per job; repairs from $300+
- **Handypeople:** $60–$100/hr

## City Differences

Rates in Sydney and Melbourne typically sit at the higher end, with Brisbane, Perth, and Adelaide slightly lower. Regional areas can be cheaper hourly but may add travel costs.

## What Drives the Price

- **Urgency:** emergency and after-hours work costs significantly more
- **Complexity:** difficult access, old systems, or specialist parts
- **Materials:** quality and quantity of parts
- **Compliance:** some work requires certificates of compliance

## How to Avoid Overpaying

- Get the call-out fee and hourly rate confirmed before booking
- Ask whether the quote is fixed or an estimate
- Request a written breakdown
- Compare a couple of quotes for non-urgent work

## Why Cheapest Isn't Always Best

A suspiciously low quote can mean unlicensed work, cut corners, or surprise add-ons. On Fixit 24/7, you see upfront pricing from verified tradies, so there are no nasty surprises.`,
  },
  {
    slug: 'before-tradie-arrives',
    title: '7 Things to Do Before Your Tradie Arrives',
    category: 'Guide',
    readTime: '3 min',
    excerpt:
      'Prepare properly and save time (and money) when your tradie shows up.',
    metaDescription:
      '7 simple things to do before your tradie arrives to save time and money on the job. A quick prep checklist for Australian homeowners.',
    content: `## A Little Prep Saves Real Money

Tradies often charge by the hour, so anything you do to help them start fast directly lowers your bill. Here's a quick checklist before they arrive.

## 1. Clear Access to the Work Area

Move furniture, boxes, cars, and clutter away from where the work will happen. If a tradie spends 20 minutes clearing a path to your hot water system, you're paying for it.

## 2. Secure Pets

Even friendly pets get in the way and can bolt through an open door. Pop them in a separate room or the yard.

## 3. Find the Relevant Shutoffs

Know where your water mains, switchboard, or gas valve is. Being able to point a tradie straight to it saves time.

## 4. Take Photos of the Problem

If the issue is intermittent — a leak that's stopped, a fault that comes and goes — photos or a short video help the tradie diagnose it quickly.

## 5. Make a List of Everything

If you've got a few small jobs, write them down. It's far cheaper to handle them in one visit than to book multiple call-outs.

## 6. Have Your Questions Ready

Note anything you want to ask — warranty, maintenance tips, or how to prevent the problem recurring.

## 7. Confirm Parking and Entry

Let the tradie know where to park and how to access the property, especially for apartments or gated complexes. A tradie circling for parking is still on the clock.

## The Bottom Line

Five minutes of preparation can shave real money off your final bill and help the job go smoothly.`,
  },
];

export function getArticle(slug: string): BlogArticle | null {
  return BLOG_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Emergency: 'bg-red-900/40 text-brand-400',
  Safety: 'bg-orange-900/40 text-orange-400',
  Guide: 'bg-brand-500/20 text-brand-400',
  Maintenance: 'bg-green-900/40 text-green-400',
  Pricing: 'bg-purple-900/40 text-purple-400',
};
