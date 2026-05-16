import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const suburb = searchParams.get('suburb');
  const state = searchParams.get('state');
  if (!suburb || !state) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const metrics = await db.suburbMetrics.findUnique({
    where: { suburb_state: { suburb, state } },
  });

  return NextResponse.json({ metrics });
}
