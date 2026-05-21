import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Static promo codes — no DB model required
const PROMO_CODES: Record<string, { discountPercent: number; description: string }> = {
  'FIRST20':      { discountPercent: 20, description: '20% off your first job' },
  'WELCOME10':    { discountPercent: 10, description: '10% off for new customers' },
  'EMERGENCY15':  { discountPercent: 15, description: '15% off emergency callouts' },
};

const Schema = z.object({
  code: z.string().min(1).max(50),
  jobValue: z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, jobValue } = Schema.parse(body);

    const normalised = code.trim().toUpperCase();
    const promo = PROMO_CODES[normalised];

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
