import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const UpdateSchema = z.object({ updates: z.record(z.string(), z.string()) });

const MARKETPLACE_DEFAULTS: Record<string, string> = {
  platform_fee_percent: '15',
  emergency_fee_aud: '15',
  emergency_surge_max: '2.0',
  dispatch_batch_size: '3',
  dispatch_offer_window_min: '3',
  dispatch_standard_window_min: '10',
  featured_tradie_price_aud: '29',
  geographic_expansion_mode: 'restricted',
  ab_test_active: 'false',
  lead_price_markup_percent: '0',
};

export async function GET() {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const configs = await db.platformConfig.findMany({ orderBy: { category: 'asc' } });
    const config: Record<string, string> = { ...MARKETPLACE_DEFAULTS };
    for (const c of configs) config[c.key] = c.value;

    return NextResponse.json({ config, defaults: MARKETPLACE_DEFAULTS });
  } catch (err) {
    console.error('[GET /api/admin/marketplace]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const { updates } = UpdateSchema.parse(await req.json());

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        db.platformConfig.upsert({ where: { key }, create: { key, value, updatedBy: session.id }, update: { value, updatedBy: session.id } })
      )
    );

    await db.adminAuditLog.create({
      data: { adminId: session.id, action: 'MARKETPLACE_CONFIG_UPDATED', entity: 'PlatformConfig', metadata: updates as never },
    });

    return NextResponse.json({ success: true, updated: Object.keys(updates).length });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[PATCH /api/admin/marketplace]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
