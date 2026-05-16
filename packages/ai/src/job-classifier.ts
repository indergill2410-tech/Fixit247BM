import { z } from 'zod';
import { openai, AI_MODELS } from './client';

const JobClassificationSchema = z.object({
  category: z.string(),
  priority: z.enum(['STANDARD', 'URGENT', 'EMERGENCY']),
  estimatedHours: z.number().nullable(),
  suggestedTitle: z.string(),
  tags: z.array(z.string()),
});

export type JobClassification = z.infer<typeof JobClassificationSchema>;

export async function classifyJob(description: string): Promise<JobClassification> {
  const response = await openai.chat.completions.create({
    model: AI_MODELS.fast,
    messages: [
      {
        role: 'system',
        content: `You are a trade job classifier for an Australian emergency services platform.
Classify the job and return valid JSON matching this schema:
{ category: string, priority: "STANDARD"|"URGENT"|"EMERGENCY", estimatedHours: number|null, suggestedTitle: string, tags: string[] }
Categories: PLUMBING, ELECTRICAL, HVAC, CARPENTRY, PAINTING, ROOFING, TILING, PEST_CONTROL, LOCKSMITH, GLAZING, PLASTERING, LANDSCAPING, CLEANING, APPLIANCE_REPAIR, GENERAL_MAINTENANCE, OTHER`,
      },
      { role: 'user', content: description },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error('Empty AI response');

  return JobClassificationSchema.parse(JSON.parse(content));
}
