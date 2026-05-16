import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { generateSuburbContent } from '@fixit247/ai';
import { z } from 'zod';

const schema = z.object({
  trade: z.string(),
  suburb: z.string(),
  state: z.string(),
  isEmergency: z.boolean().default(false),
});

const TRADE_NAMES: Record<string, string> = {
  PLUMBING: 'Plumber', ELECTRICAL: 'Electrician', HVAC: 'HVAC Technician',
  CARPENTRY: 'Carpenter', PAINTING: 'Painter', ROOFING: 'Roofer',
  TILING: 'Tiler', PEST_CONTROL: 'Pest Controller', LOCKSMITH: 'Locksmith',
  GLAZING: 'Glazier', PLASTERING: 'Plasterer', LANDSCAPING: 'Landscaper',
  CLEANING: 'Cleaner', APPLIANCE_REPAIR: 'Appliance Technician',
  GENERAL_MAINTENANCE: 'Handyman',
};

export async function POST(req: Request) {
  await requireRole('ADMIN');
  const body = schema.parse(await req.json());

  const tradeName = TRADE_NAMES[body.trade.toUpperCase()] ?? body.trade;
  const slug = body.isEmergency
    ? `emergency/${body.trade.toLowerCase()}/${body.suburb.toLowerCase().replace(/\s+/g, '-')}`
    : `trade/${body.trade.toLowerCase()}/${body.suburb.toLowerCase().replace(/\s+/g, '-')}`;

  const content = await generateSuburbContent({
    trade: body.trade.toUpperCase(),
    tradeName,
    suburb: body.suburb,
    state: body.state,
    isEmergency: body.isEmergency,
  });

  const title = body.isEmergency
    ? `Emergency ${tradeName} ${body.suburb} | 24/7 Same-Day | Fixit 24/7`
    : `${tradeName} ${body.suburb} | Same-Day Service | Fixit 24/7`;

  const page = await db.sEOPage.upsert({
    where: { slug },
    create: {
      slug,
      pageType: body.isEmergency ? 'EMERGENCY_SERVICE' : 'SUBURB_TRADE',
      title,
      metaDescription: content.intro,
      h1: body.isEmergency ? `Emergency ${tradeName} in ${body.suburb}` : `${tradeName} in ${body.suburb}`,
      suburb: body.suburb,
      state: body.state,
      tradeCategory: body.trade.toUpperCase(),
      isEmergency: body.isEmergency,
      content: content as any,
      faqContent: content.faqs as any,
      publishedAt: new Date(),
      lastGeneratedAt: new Date(),
    },
    update: {
      content: content as any,
      faqContent: content.faqs as any,
      lastGeneratedAt: new Date(),
    },
  });

  return NextResponse.json({ page, content });
}
