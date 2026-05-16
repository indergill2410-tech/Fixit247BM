import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

export async function GET(req: Request) {
  await requireRole('ADMIN');
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') ?? 'all';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);

  const where =
    filter === 'underserved' ? { isUnderserved: true }
    : filter === 'high-demand' ? { demandScore: { gt: 60 } }
    : {};

  const suburbs = await db.suburbMetrics.findMany({
    where,
    orderBy: { expansionPriority: 'desc' },
    take: limit,
  });

  const stats = await db.suburbMetrics.aggregate({
    _count: { id: true },
    _avg: { demandScore: true, supplyScore: true, conversionRate: true },
  });

  return NextResponse.json({ suburbs, stats });
}

export async function PATCH(req: Request) {
  await requireRole('ADMIN');
  const body = z
    .object({
      suburb: z.string(),
      state: z.string(),
      expansionPriority: z.number().min(0).max(10).optional(),
      isUnderserved: z.boolean().optional(),
    })
    .parse(await req.json());

  const updated = await db.suburbMetrics.update({
    where: { suburb_state: { suburb: body.suburb, state: body.state } },
    data: {
      ...(body.expansionPriority !== undefined && { expansionPriority: body.expansionPriority }),
      ...(body.isUnderserved !== undefined && { isUnderserved: body.isUnderserved }),
    },
  });

  return NextResponse.json({ suburb: updated });
}
