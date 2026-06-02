import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { lookupPromoCode } from '@/lib/promo';

const Schema = z.object({
  code: z.string().min(1).max(50),
  jobValue: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const { code, jobValue } = Schema.parse(body);

    const promo = await lookupPromoCode(code);

    if (!promo) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired promo code' });
    }

    const discountAmount =
      jobValue !== undefined
        ? Math.round(jobValue * (promo.discountPercent / 100) * 100) / 100
        : undefined;

    return NextResponse.json({
      valid: true,
      discountPercent: promo.discountPercent,
      discountAmount,
      message: promo.description,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ valid: false, message: 'Invalid request data' }, { status: 400 });
    }
    logger.error('[POST /api/promo/validate]', err);
    return NextResponse.json({ valid: false, message: 'Failed to validate promo code' }, { status: 500 });
  }
}
