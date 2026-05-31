import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const CreateSchema = z.object({
  type: z.enum(['FRAUD_SPIKE', 'PAYMENT_FAILURE', 'DISPATCH_FAILURE', 'UNUSUAL_REFUNDS', 'SYSTEM_ERROR', 'REVENUE_DROP', 'HIGH_DISPUTE_RATE', 'TRADIE_SHORTAGE']),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  title: z.string().min(1),
  message: z.string().min(1),
  data: z.record(z.unknown()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const status = req.nextUrl.searchParams.get('status') ?? 'ACTIVE';
    const alerts = await db.platformAlert.findMany({
      where: { status: status as never },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });

    return NextResponse.json({ alerts });
  } catch (err) {
    logger.error('[GET /api/admin/alerts]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const data = CreateSchema.parse(await req.json());

    const alert = await db.platformAlert.create({ data: data as never });
    return NextResponse.json({ alert }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    logger.error('[POST /api/admin/alerts]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
