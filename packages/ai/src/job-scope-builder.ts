import { z } from 'zod';
import { openai, AI_MODELS } from './client';

export const TRADE_CATEGORIES = [
  'PLUMBING', 'ELECTRICAL', 'HVAC', 'CARPENTRY', 'PAINTING', 'ROOFING',
  'TILING', 'PEST_CONTROL', 'LOCKSMITH', 'GLAZING', 'PLASTERING',
  'LANDSCAPING', 'CLEANING', 'APPLIANCE_REPAIR', 'GENERAL_MAINTENANCE', 'OTHER',
] as const;

export type TradeCategory = typeof TRADE_CATEGORIES[number];

export const JobComplexitySchema = z.enum(['SIMPLE', 'MEDIUM', 'COMPLEX']);
export type AIScopeJobComplexity = z.infer<typeof JobComplexitySchema>;

export const AIScopeResultSchema = z.object({
  suggestedTitle: z.string().min(5).max(120),
  professionalSummary: z.string().min(20).max(600),
  category: z.enum(TRADE_CATEGORIES),
  complexity: JobComplexitySchema,
  urgencyScore: z.number().int().min(0).max(100),
  confidenceScore: z.number().int().min(0).max(100),
  isEmergency: z.boolean(),
  emergencyIndicators: z.array(z.string()),
  suggestedTrades: z.array(z.enum(TRADE_CATEGORIES)),
  suggestedMaterials: z.array(z.string()),
  estimatedPriceMin: z.number().nullable(),
  estimatedPriceMax: z.number().nullable(),
  estimatedHours: z.number().nullable(),
  preferredTimeframe: z.enum(['ASAP', 'TODAY', 'THIS_WEEK', 'FLEXIBLE']),
  safetyRisk: z.boolean(),
  safetyNotes: z.string().nullable(),
});

export type AIScopeResult = z.infer<typeof AIScopeResultSchema>;

export interface ScopeBuilderInput {
  textDescription?: string;
  voiceTranscript?: string;
  imageDescriptions?: string[];   // Already-analyzed image descriptions
  location?: { suburb: string; state: string };
  customerContext?: {
    previousJobs?: number;
    isRepeatCustomer?: boolean;
  };
}

const SYSTEM_PROMPT = `You are an expert Australian trade job scope analyst for Fixit 24/7, an emergency home services platform.

Your job is to analyze customer input (which may be vague, informal, or multi-modal) and produce a structured, professional job analysis.

Australian context:
- Prices in AUD. Plumbing: $300-2000, Electrical: $200-5000+, HVAC: $300-2000, Glazing: $200-800, Locksmith: $100-350, Roofing: $500-8000+
- Emergency indicators: "burst", "flooding", "no power", "can't get in", "gas smell", "leaking", "no hot water", "broken", "urgent", "asap", "emergency", "tripping", "sparking", "locked out"
- Urgency score 0-100: 0=flexible, 40=same day, 70=urgent today, 90+=emergency
- Confidence: how certain you are of the category/scope (0-100)

Return ONLY valid JSON matching the specified schema. Never make up prices — use null if uncertain. Always prioritize safety.`;

export async function buildJobScope(input: ScopeBuilderInput): Promise<AIScopeResult> {
  const startMs = Date.now();

  const userContent = buildUserContent(input);

  const response = await openai.chat.completions.create({
    model: AI_MODELS.smart,  // GPT-4o for accuracy
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.15,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error('Empty AI response from scope builder');

  const parsed = JSON.parse(content);
  const result = AIScopeResultSchema.parse(parsed);

  console.log(`[AI Scope] Processed in ${Date.now() - startMs}ms — category: ${result.category}, urgency: ${result.urgencyScore}`);

  return result;
}

function buildUserContent(input: ScopeBuilderInput): string {
  const parts: string[] = [];

  if (input.textDescription) {
    parts.push(`Customer description: "${input.textDescription}"`);
  }

  if (input.voiceTranscript) {
    parts.push(`Voice note transcript: "${input.voiceTranscript}"`);
  }

  if (input.imageDescriptions && input.imageDescriptions.length > 0) {
    parts.push(`Images show: ${input.imageDescriptions.join('; ')}`);
  }

  if (input.location) {
    parts.push(`Location: ${input.location.suburb}, ${input.location.state}`);
  }

  if (input.customerContext) {
    if (input.customerContext.previousJobs) {
      parts.push(`Customer has ${input.customerContext.previousJobs} previous jobs on the platform`);
    }
  }

  parts.push(`\nAnalyze this job request and return the structured JSON scope analysis.`);

  return parts.join('\n');
}

export function getUrgencyLabel(score: number): string {
  if (score >= 90) return 'CRITICAL EMERGENCY';
  if (score >= 70) return 'Emergency — respond within 1 hour';
  if (score >= 50) return 'Urgent — same day';
  if (score >= 30) return 'Priority — within 2 days';
  return 'Standard — flexible timing';
}
