import { openai } from './client';
import { z } from 'zod';

const ImageAnalysisSchema = z.object({
  description: z.string(),
  detectedIssues: z.array(z.string()),
  suggestedCategory: z.string().nullable(),
  severity: z.enum(['MINOR', 'MODERATE', 'SEVERE', 'CRITICAL']),
  isEmergencyVisible: z.boolean(),
  safetyHazards: z.array(z.string()),
  estimatedDamageScope: z.string().nullable(),
});

export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

export async function analyzeJobImage(imageUrl: string): Promise<ImageAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert Australian trade inspector. Analyze the image for home repair/maintenance issues.
Return JSON: { description, detectedIssues: string[], suggestedCategory: string|null, severity: "MINOR"|"MODERATE"|"SEVERE"|"CRITICAL", isEmergencyVisible: boolean, safetyHazards: string[], estimatedDamageScope: string|null }`,
      },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
          { type: 'text', text: 'Analyze this image for trade/repair issues. What trade is needed? How severe?' },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 500,
    temperature: 0.1,
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error('Empty vision response');

  return ImageAnalysisSchema.parse(JSON.parse(content));
}

export async function analyzeMultipleImages(imageUrls: string[]): Promise<{
  combined: string;
  analyses: ImageAnalysis[];
  overallSeverity: ImageAnalysis['severity'];
}> {
  const analyses = await Promise.all(imageUrls.slice(0, 4).map(analyzeJobImage));

  const severityRank: Record<ImageAnalysis['severity'], number> = {
    MINOR: 1, MODERATE: 2, SEVERE: 3, CRITICAL: 4,
  };

  const overallSeverity = analyses.reduce<ImageAnalysis['severity']>(
    (max: ImageAnalysis['severity'], a: ImageAnalysis): ImageAnalysis['severity'] => {
      const aRank = severityRank[a.severity] ?? 0;
      const maxRank = severityRank[max] ?? 0;
      return aRank > maxRank ? a.severity : max;
    },
    'MINOR'
  );

  const combined = analyses.map((a: ImageAnalysis, i: number) => `Image ${i + 1}: ${a.description}`).join('. ');

  return { combined, analyses, overallSeverity };
}
