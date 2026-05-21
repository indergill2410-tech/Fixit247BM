import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const UpdateSchema = z.object({
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  quietHoursEnabled: z.boolean().optional(),
  quietHoursStart: z.number().min(0).max(23).nullable().optional(),
  quietHoursEnd: z.number().min(0).max(23).nullable().optional(),
  disabledTypes: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const session = await requireSession();
    const prefs = await db.notificationPreference.findUnique({ where: { userId: session.id } });
    return NextResponse.json({
      preferences: prefs ?? {
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        quietHoursEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
        disabledTypes: [],
      },
    });
  } catch (err) {
    console.error('[GET /api/notifications/preferences]', err);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = UpdateSchema.parse(body);

    const prefs = await db.notificationPreference.upsert({
      where: { userId: session.id },
      create: { userId: session.id, ...data } as never,
      update: data as never,
    });

    return NextResponse.json({ preferences: prefs });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[PATCH /api/notifications/preferences]', err);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
