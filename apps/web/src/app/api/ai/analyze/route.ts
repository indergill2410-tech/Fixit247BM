import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { z } from 'zod';

const AnalyzeSchema = z.object({
  textDescription: z.string().min(5).max(2000).optional(),
  voiceTranscript: z.string().max(2000).optional(),
  imageUrls: z.array(z.string().url()).max(4).default([]),
  location: z.object({
    suburb: z.string(),
    state: z.string(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { rateLimit, rateLimitResponse, LIMITS } = await import('@/lib/api/rate-limit');
    const rl = rateLimit(req, LIMITS.ai);
    if (!rl.success) return rateLimitResponse(rl);

    await requireSession();
    const body = await req.json();
    const data = AnalyzeSchema.parse(body);

    if (!data.textDescription && !data.voiceTranscript && data.imageUrls.length === 0) {
      return NextResponse.json({ error: 'Provide at least one input (text, voice, or image)' }, { status: 400 });
    }

    // Dynamically import to avoid bundle size issues
    const { buildJobScope } = await import('@fixit247/ai').catch(() => ({
      buildJobScope: null,
    }));

    if (!buildJobScope) {
      // Fallback if AI package not available
      return NextResponse.json({
        result: {
          suggestedTitle: 'Trade job request',
          professionalSummary: data.textDescription ?? 'Job details pending review.',
          category: 'GENERAL_MAINTENANCE',
          complexity: 'MEDIUM',
          urgencyScore: 30,
          confidenceScore: 50,
          isEmergency: false,
          emergencyIndicators: [],
          suggestedTrades: ['GENERAL_MAINTENANCE'],
          suggestedMaterials: [],
          estimatedPriceMin: null,
          estimatedPriceMax: null,
          estimatedHours: null,
          preferredTimeframe: 'FLEXIBLE',
          safetyRisk: false,
          safetyNotes: null,
        },
        processingMs: 0,
      });
    }

    const startMs = Date.now();

    let imageDescriptions: string[] = [];
    if (data.imageUrls.length > 0) {
      try {
        const { analyzeMultipleImages } = await import('@fixit247/ai');
        const imageResult = await analyzeMultipleImages(data.imageUrls);
        imageDescriptions = imageResult.analyses.map((a) => a.description);
      } catch {
        // Image analysis optional — continue without it
      }
    }

    const result = await buildJobScope({
      textDescription: data.textDescription,
      voiceTranscript: data.voiceTranscript,
      imageDescriptions: imageDescriptions.length > 0 ? imageDescriptions : undefined,
      location: data.location,
    });

    return NextResponse.json({ result, processingMs: Date.now() - startMs });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/ai/analyze]', err);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
