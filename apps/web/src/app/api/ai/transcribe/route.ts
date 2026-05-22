import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { rateLimit, rateLimitResponse, LIMITS } = await import('@/lib/api/rate-limit');
    const rl = await rateLimit(req, LIMITS.ai);
    if (!rl.success) return rateLimitResponse(rl);

    await requireSession();

    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile || typeof audioFile === 'string') {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const filename = audioFile instanceof File ? audioFile.name : 'voice-note.webm';

    const { transcribeVoiceNote, sanitizeTranscript } = await import('@fixit247/ai');
    const result = await transcribeVoiceNote(buffer, filename);

    return NextResponse.json({
      transcript: sanitizeTranscript(result.text),
      raw: result.text,
      duration: result.duration,
    });
  } catch (err) {
    logger.error('[POST /api/ai/transcribe]', err);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
