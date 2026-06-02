import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const PatchSchema = z.object({
  action: z.enum(['SUSPEND', 'UNSUSPEND', 'CHANGE_ROLE']),
  role: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      include: {
        tradieProfile: true,
        subscription: true,
      },
    });

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Get customer & tradie profile ids for job queries
    const customerProfile = await db.customerProfile.findUnique({ where: { userId: id }, select: { id: true } });
    const tradieProfile = user.tradieProfile;

    const jobWhereOr: Record<string, unknown>[] = [];
    if (customerProfile) jobWhereOr.push({ customerId: customerProfile.id });
    if (tradieProfile) jobWhereOr.push({ tradieId: tradieProfile.id });

    const [recentJobs, recentPayments, totalJobsAsCustomer, totalJobsAsTradie] = await Promise.all([
      jobWhereOr.length > 0
        ? db.job.findMany({
            where: { OR: jobWhereOr as never },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              title: true,
              status: true,
              category: true,
              customerId: true,
              tradieId: true,
              createdAt: true,
              completedAt: true,
              finalPrice: true,
              agreedPrice: true,
            },
          })
        : Promise.resolve([]),
      customerProfile
        ? db.payment.findMany({
            where: { customerId: customerProfile.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { job: { select: { title: true } } },
          })
        : Promise.resolve([]),
      customerProfile
        ? db.job.count({ where: { customerId: customerProfile.id } })
        : Promise.resolve(0),
      tradieProfile
        ? db.job.count({ where: { tradieId: tradieProfile.id } })
        : Promise.resolve(0),
    ]);

    // Compute totalSpent and totalEarned from payments
    const totalSpent = customerProfile
      ? await db.payment.aggregate({
          where: { customerId: customerProfile.id, status: 'COMPLETED' },
          _sum: { amount: true },
        })
      : null;

    const totalEarned = tradieProfile
      ? await db.payment.aggregate({
          where: { tradieId: tradieProfile.id, status: 'COMPLETED' },
          _sum: { tradieAmount: true },
        })
      : null;

    return NextResponse.json({
      user,
      recentJobs,
      recentPayments,
      stats: {
        totalJobsAsCustomer,
        totalJobsAsTradie,
        totalSpent: Number(totalSpent?._sum.amount ?? 0),
        totalEarned: Number(totalEarned?._sum.tradieAmount ?? 0),
      },
    });
  } catch (err) {
    logger.error('[GET /api/admin/users/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = PatchSchema.parse(await req.json());

    const target = await db.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Prevent modifying SUPER_ADMIN users
    if (target.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot modify SUPER_ADMIN accounts' }, { status: 403 });
    }

    let update: Record<string, unknown> = {};

    if (body.action === 'SUSPEND') {
      update = { isActive: false };
    } else if (body.action === 'UNSUSPEND') {
      update = { isActive: true };
    } else if (body.action === 'CHANGE_ROLE') {
      if (!body.role) return NextResponse.json({ error: 'role is required for CHANGE_ROLE' }, { status: 400 });
      if (body.role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Cannot assign SUPER_ADMIN role' }, { status: 403 });
      }
      update = { role: body.role };
    }

    const user = await db.user.update({ where: { id }, data: update as never });

    await db.adminAuditLog.create({
      data: {
        adminId: session.id,
        action: body.action === 'SUSPEND' ? 'USER_SUSPENDED' : body.action === 'UNSUSPEND' ? 'USER_UNSUSPENDED' : 'USER_ROLE_CHANGED',
        entity: 'User',
        entityId: id,
        metadata: { action: body.action, role: body.role } as never,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    logger.error('[PATCH /api/admin/users/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
