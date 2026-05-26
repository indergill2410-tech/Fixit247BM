import OpenAI from 'openai';
import { SYSTEM_PROMPT, ExtractedJobData, ConversationContext } from './conversation';
import { detectEmergency } from './emergency-detector';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
  return _openai;
}
const openai = new Proxy({} as OpenAI, { get(_t, p) { return (getOpenAI() as never)[p as keyof OpenAI]; } });

const MAX_TURNS_BEFORE_HANDOVER = 8;

export interface AIResponse {
  message: string;
  isJobReady: boolean;
  extractedJobData?: Partial<ExtractedJobData>;
  emergencyDetected: boolean;
  emergencyScore: number;
  requiresHumanTakeover: boolean;
  safetyInstructions?: string[];
}

interface ExtractedJobDetails {
  suburb?: string;
  state?: string;
  postcode?: string;
  tradeCategory?: string;
  issue?: string;
  isEmergency?: boolean;
  urgencyScore?: number;
}

async function extractJobDetailsWithFunctionCall(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
): Promise<ExtractedJobDetails | null> {
  try {
    const extractionResponse = await (getOpenAI()).chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: [{
        type: 'function',
        function: {
          name: 'extract_job_details',
          description: 'Extract job booking details from the conversation',
          parameters: {
            type: 'object',
            properties: {
              suburb: { type: 'string', description: 'The suburb or area name, e.g. "Sydney CBD", "Fortitude Valley"' },
              state: { type: 'string', description: 'Australian state abbreviation: NSW, VIC, QLD, WA, SA, TAS, ACT, NT' },
              postcode: { type: 'string', description: 'Australian postcode if mentioned' },
              tradeCategory: { type: 'string', enum: ['PLUMBING', 'ELECTRICAL', 'HVAC', 'CARPENTRY', 'ROOFING', 'LOCKSMITH', 'GLAZING', 'PEST_CONTROL', 'PLASTERING', 'GENERAL_MAINTENANCE'] },
              issue: { type: 'string', description: 'Description of the problem' },
              isEmergency: { type: 'boolean' },
              urgencyScore: { type: 'number', minimum: 0, maximum: 100 },
            },
            required: ['tradeCategory', 'issue'],
          },
        },
      }],
      tool_choice: { type: 'function', function: { name: 'extract_job_details' } },
    });

    const toolCall = extractionResponse.choices[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      return JSON.parse(toolCall.function.arguments) as ExtractedJobDetails;
    }
  } catch {
    // Fall through — return null so caller can fall back to regex
  }
  return null;
}

export async function processConversationTurn(
  userMessage: string,
  context: ConversationContext,
): Promise<AIResponse> {
  const emergency = detectEmergency(userMessage);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...context.messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: userMessage },
  ];

  // Max-turn check: if too many turns and job not ready, trigger human takeover
  const turnCount = context.turnCount + 1;
  if (turnCount >= MAX_TURNS_BEFORE_HANDOVER && !context.isComplete) {
    return {
      message: "Let me connect you with one of our team members who can help you right away.",
      isJobReady: false,
      emergencyDetected: emergency.isEmergency,
      emergencyScore: emergency.emergencyScore,
      requiresHumanTakeover: true,
      ...(emergency.safetyInstructions.length > 0 && { safetyInstructions: emergency.safetyInstructions }),
    };
  }

  const response = await (getOpenAI()).chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 300,
    temperature: 0.7,
  });

  const rawResponse = response.choices[0]?.message.content ?? '';

  let isJobReady = false;
  let extractedJobData: Partial<ExtractedJobData> | undefined;

  // First attempt: parse inline job_ready block from the LLM response
  const jobReadyMatch = rawResponse.match(/```job_ready\n([\s\S]+?)\n```/);
  if (jobReadyMatch?.[1]) {
    try {
      const parsed = JSON.parse(jobReadyMatch[1]) as Partial<ExtractedJobData>;
      // Replace regex-extracted suburb with structured extraction for accuracy
      const structured = await extractJobDetailsWithFunctionCall(messages);
      if (structured) {
        extractedJobData = {
          ...parsed,
          suburb: structured.suburb ?? parsed.suburb ?? null,
          tradeCategory: structured.tradeCategory ?? parsed.tradeCategory ?? null,
          issue: structured.issue ?? parsed.issue ?? null,
          isEmergency: structured.isEmergency ?? parsed.isEmergency ?? false,
          urgencyScore: structured.urgencyScore ?? parsed.urgencyScore ?? 0,
          additionalNotes: parsed.additionalNotes ?? null,
        };
      } else {
        extractedJobData = parsed;
      }
      isJobReady = true;
    } catch { /* ignore parse errors */ }
  }

  const cleanMessage = rawResponse.replace(/```job_ready[\s\S]+?```/g, '').trim();

  const requiresHumanTakeover = emergency.riskLevel === 'LIFE_THREATENING' && context.turnCount > 3;

  const result: AIResponse = {
    message: cleanMessage,
    isJobReady,
    emergencyDetected: emergency.isEmergency,
    emergencyScore: emergency.emergencyScore,
    requiresHumanTakeover,
    ...(isJobReady && extractedJobData !== undefined && { extractedJobData }),
    ...(emergency.safetyInstructions.length > 0 && { safetyInstructions: emergency.safetyInstructions }),
  };
  return result;
}

export async function generateJobSummary(context: ConversationContext): Promise<string> {
  const transcript = context.messages
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Based on this conversation, write a concise job description for a tradie (2-3 sentences, professional tone):\n\n${transcript}`,
    }],
    max_tokens: 150,
    temperature: 0.5,
  });

  return response.choices[0]?.message.content ?? 'Emergency service required.';
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const file = new File([new Uint8Array(audioBuffer)], 'audio.webm', { type: 'audio/webm' });
  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'en',
    prompt: 'Australian emergency home services. Trade terms: plumber, electrician, locksmith, HVAC.',
  });
  return response.text;
}
