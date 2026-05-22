import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { TradeCategory } from '@fixit247/database';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const UpdateProfileSchema = z.object({
  businessName: z.string().min(1).max(120).optional(),
  bio: z.string().max(2000).optional(),
  trades: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional().nullable(),
  calloutFee: z.number().positive().optional().nullable(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  serviceRadiusKm: z.number().int().min(1).max(200).optional(),
  abn: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await requireRole('TRADIE');

    const profile = await db.tradieProfile.findUnique({
      where: { userId: session.id },
      include: {
        licences: { orderBy: { createdAt: 'desc' }, take: 1 },
        insurances: { orderBy: { createdAt: 'desc' }, take: 1 },
        documents: { orderBy: { uploadedAt: 'desc' } },
      },
    });

    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true },
    });

    return NextResponse.json({ profile, user });
  } catch (err) {
    logger.error('[GET /api/tradie/profile]', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole('TRADIE');

    const body = await req.json();
    const data = UpdateProfileSchema.parse(body);

    const profile = await db.tradieProfile.update({
      where: { userId: session.id },
      data: {
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.trades !== undefined && { trades: data.trades as TradeCategory[] }),
        ...(data.hourlyRate !== undefined && { hourlyRate: data.hourlyRate }),
        ...(data.calloutFee !== undefined && { calloutFee: data.calloutFee }),
        ...(data.yearsExperience !== undefined && { yearsExperience: data.yearsExperience }),
        ...(data.serviceRadiusKm !== undefined && { serviceRadiusKm: data.serviceRadiusKm }),
        ...(data.abn !== undefined && { abn: data.abn }),
      },
    });

    return NextResponse.json({ profile });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    logger.error('[PATCH /api/tradie/profile]', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
