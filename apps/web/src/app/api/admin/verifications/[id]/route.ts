import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const PatchSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const profile = await db.tradieProfile.findUnique({
      where: { id },
      include: {
        user: true,
        licences: true,
        insurances: true,
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, title: true, status: true, createdAt: true, completedAt: true },
        },
      },
    });

    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Fetch reviews where reviewee is this tradie's userId
    const reviews = await db.review.findMany({
      where: { revieweeId: profile.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        createdAt: true,
        reviewer: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ profile, reviews });
  } catch (err) {
    logger.error('[GET /api/admin/verifications/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = PatchSchema.parse(await req.json());

    const profile = await db.tradieProfile.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (body.action === 'APPROVE') {
      const [updated] = await db.$transaction([
        db.tradieProfile.update({
          where: { id },
          data: { verificationStatus: 'VERIFIED' },
        }),
        db.licence.updateMany({
          where: { tradieId: id, status: 'PENDING' },
          data: { status: 'VERIFIED', verifiedAt: new Date() },
        }),
        db.adminAuditLog.create({
          data: {
            adminId: session.id,
            action: 'TRADIE_VERIFIED',
            entity: 'TradieProfile',
            entityId: id,
            metadata: {} as never,
          },
        }),
      ]);
      return NextResponse.json({ profile: updated });
    }

    if (body.action === 'REJECT') {
      const [updated] = await db.$transaction([
        db.tradieProfile.update({
          where: { id },
          data: { verificationStatus: 'REJECTED' },
        }),
        db.adminAuditLog.create({
          data: {
            adminId: session.id,
            action: 'TRADIE_REJECTED',
            entity: 'TradieProfile',
            entityId: id,
            metadata: { reason: body.reason ?? 'No reason provided' } as never,
          },
        }),
      ]);
      return NextResponse.json({ profile: updated });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    logger.error('[PATCH /api/admin/verifications/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
