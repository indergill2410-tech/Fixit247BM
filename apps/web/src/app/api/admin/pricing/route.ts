import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const DEFAULT_CONFIG: Record<string, string> = {
  platform_fee_percent: '15',
  credit_cost_simple_standard: '1',
  credit_cost_medium_standard: '3',
  credit_cost_complex_standard: '5',
  emergency_dispatch_fee_aud: '15',
  surge_enabled: 'true',
  referral_bonus_credits: '5',
};

export async function GET() {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const configs = await db.platformConfig.findMany({ orderBy: { category: 'asc' } });
    const configMap: Record<string, string> = { ...DEFAULT_CONFIG };
    for (const c of configs) configMap[c.key] = c.value;

    return NextResponse.json({ config: configMap });
  } catch (err) {
    logger.error('[GET /api/admin/pricing]', err);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

const UpdateSchema = z.object({
  updates: z.record(z.string(), z.string()),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json() as unknown;
    const { updates } = UpdateSchema.parse(body);

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        db.platformConfig.upsert({
          where: { key },
          create: { key, value, updatedBy: session.id },
          update: { value, updatedBy: session.id },
        })
      )
    );

    return NextResponse.json({ success: true, updated: Object.keys(updates).length });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    logger.error('[PATCH /api/admin/pricing]', err);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
