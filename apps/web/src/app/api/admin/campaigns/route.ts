import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

export async function GET() {
  await requireRole('ADMIN');
  const campaigns = await db.marketingCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const stats = await db.marketingCampaign.aggregate({
    _sum: { costSpent: true, revenueGenerated: true, conversionCount: true },
    _count: { id: true },
  });
  return NextResponse.json({ campaigns, stats });
}

export async function POST(req: Request) {
  await requireRole('ADMIN');
  const body = z
    .object({
      name: z.string().min(1),
      type: z.enum(['EMAIL', 'PUSH', 'SMS', 'REFERRAL', 'SEO', 'PAID_SOCIAL', 'RETARGETING']),
      targetAudience: z.record(z.unknown()).optional(),
      content: z.record(z.unknown()).optional(),
      scheduledAt: z.string().datetime().optional(),
    })
    .parse(await req.json());

  const campaign = await db.marketingCampaign.create({
    data: {
      name: body.name,
      type: body.type,
      targetAudience: body.targetAudience ?? {},
      content: body.content ?? {},
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      status: 'DRAFT',
    },
  });
  return NextResponse.json({ campaign }, { status: 201 });
}
