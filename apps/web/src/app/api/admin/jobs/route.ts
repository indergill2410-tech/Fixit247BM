import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const trade = searchParams.get('trade');
    const isEmergency = searchParams.get('isEmergency');
    const isExport = searchParams.get('export') === 'true';
    const limit = Math.min(Number(searchParams.get('limit') ?? '50'), isExport ? 10000 : 200);
    const offset = Number(searchParams.get('offset') ?? '0');

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;
    if (trade && trade !== 'ALL') where.category = trade;
    if (isEmergency === 'true') where.isEmergency = true;
    else if (isEmergency === 'false') where.isEmergency = false;

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          status: true,
          category: true,
          isEmergency: true,
          createdAt: true,
          completedAt: true,
          customerId: true,
          tradieId: true,
          customer: {
            select: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
          tradie: {
            select: {
              businessName: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
          payment: {
            select: { amount: true, status: true },
          },
          address: {
            select: { suburb: true },
          },
        },
      }),
      db.job.count({ where }),
    ]);

    const formatted = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      status: j.status,
      category: j.category,
      isEmergency: j.isEmergency,
      suburb: j.address?.suburb ?? null,
      createdAt: j.createdAt,
      completedAt: j.completedAt,
      customerId: j.customerId,
      tradieId: j.tradieId,
      customer: j.customer?.user ?? null,
      tradie: j.tradie
        ? {
            firstName: j.tradie.user?.firstName ?? null,
            lastName: j.tradie.user?.lastName ?? null,
            businessName: j.tradie.businessName ?? null,
          }
        : null,
      payment: j.payment
        ? { amount: j.payment.amount, status: j.payment.status }
        : null,
    }));

    return NextResponse.json({ jobs: formatted, total });
  } catch (err) {
    logger.error('[GET /api/admin/jobs]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
