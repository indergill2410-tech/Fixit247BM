import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const CreateSchema = z.object({
  userId: z.string().uuid(),
  subject: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['PAYMENT', 'JOB_ISSUE', 'ACCOUNT', 'TECHNICAL', 'FRAUD', 'OTHER']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  jobId: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const status = req.nextUrl.searchParams.get('status');
    const priority = req.nextUrl.searchParams.get('priority');
    const search = req.nextUrl.searchParams.get('search');
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 100);

    const tickets = await db.supportTicket.findMany({
      where: {
        ...(status && status !== 'ALL' ? { status: status as never } : { status: { not: 'CLOSED' } }),
        ...(priority ? { priority: priority as never } : {}),
        ...(search ? { subject: { contains: search, mode: 'insensitive' } } : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: limit,
    });

    const counts = await db.supportTicket.groupBy({ by: ['status'], _count: { id: true }, where: { status: { not: 'CLOSED' } } });
    return NextResponse.json({ tickets, counts });
  } catch (err) {
    console.error('[GET /api/admin/support]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const data = CreateSchema.parse(await req.json());

    const ticket = await db.supportTicket.create({
      data: { ...data, assignedTo: session.id } as never,
    });
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[POST /api/admin/support]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
