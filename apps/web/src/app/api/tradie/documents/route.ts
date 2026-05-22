import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const UploadDocSchema = z.object({
  type: z.enum(['TRADE_LICENCE', 'INSURANCE', 'POLICE_CHECK', 'IDENTITY', 'OTHER']),
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET() {
  try {
    const session = await requireRole('TRADIE');

    const tradieProfile = await db.tradieProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!tradieProfile) return NextResponse.json({ documents: [] });

    const documents = await db.tradieDocument.findMany({
      where: { tradieId: tradieProfile.id },
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (err) {
    logger.error('[GET /api/tradie/documents]', err);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole('TRADIE');

    const tradieProfile = await db.tradieProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!tradieProfile) {
      return NextResponse.json({ error: 'Tradie profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const data = UploadDocSchema.parse(body);

    const document = await db.tradieDocument.create({
      data: {
        tradieId: tradieProfile.id,
        type: data.type,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    logger.error('[POST /api/tradie/documents]', err);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
