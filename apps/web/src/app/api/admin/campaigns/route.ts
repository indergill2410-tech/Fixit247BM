import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import type { Prisma } from '@fixit247/database';
import { z } from 'zod';

export async function GET() {
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;
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
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;
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
      targetAudience: (body.targetAudience ?? {}) as Prisma.InputJsonValue,
      content: (body.content ?? {}) as Prisma.InputJsonValue,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      status: 'DRAFT',
    },
  });
  return NextResponse.json({ campaign }, { status: 201 });
}
