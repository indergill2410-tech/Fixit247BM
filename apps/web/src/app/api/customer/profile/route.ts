import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
  phone: z.string().max(30).optional().nullable(),
  suburb: z.string().max(120).optional().nullable(),
  postcode: z.string().max(10).optional().nullable(),
  state: z.string().max(10).optional().nullable(),
  emergencyContactName: z.string().max(120).optional().nullable(),
  emergencyContactPhone: z.string().max(30).optional().nullable(),
  notifyBySms: z.boolean().optional(),
  notifyByEmail: z.boolean().optional(),
  notifyByPush: z.boolean().optional(),
});

export async function GET() {
  const session = await requireApiRole('CUSTOMER');
  if (session instanceof NextResponse) return session;

  try {
    const [user, profile] = await Promise.all([
      db.user.findUnique({
        where: { id: session.id },
        select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true },
      }),
      db.customerProfile.findUnique({
        where: { userId: session.id },
        select: {
          suburb: true,
          postcode: true,
          state: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          notifyBySms: true,
          notifyByEmail: true,
          notifyByPush: true,
        },
      }),
    ]);

    return NextResponse.json({ user, profile });
  } catch (err) {
    logger.error('[GET /api/customer/profile]', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireApiRole('CUSTOMER');
  if (session instanceof NextResponse) return session;

  try {
    const body = (await req.json()) as unknown;
    const data = UpdateProfileSchema.parse(body);

    const userData = {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.phone !== undefined && { phone: data.phone }),
    };

    const profileData = {
      ...(data.suburb !== undefined && { suburb: data.suburb }),
      ...(data.postcode !== undefined && { postcode: data.postcode }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.emergencyContactName !== undefined && { emergencyContactName: data.emergencyContactName }),
      ...(data.emergencyContactPhone !== undefined && { emergencyContactPhone: data.emergencyContactPhone }),
      ...(data.notifyBySms !== undefined && { notifyBySms: data.notifyBySms }),
      ...(data.notifyByEmail !== undefined && { notifyByEmail: data.notifyByEmail }),
      ...(data.notifyByPush !== undefined && { notifyByPush: data.notifyByPush }),
    };

    await db.$transaction([
      ...(Object.keys(userData).length > 0
        ? [db.user.update({ where: { id: session.id }, data: userData })]
        : []),
      ...(Object.keys(profileData).length > 0
        ? [db.customerProfile.update({ where: { userId: session.id }, data: profileData })]
        : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.flatten() }, { status: 400 });
    }
    logger.error('[PATCH /api/customer/profile]', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
