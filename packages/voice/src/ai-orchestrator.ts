import OpenAI from 'openai';
import { SYSTEM_PROMPT, ConversationTurn, ExtractedJobData, ConversationContext } from './conversation';
import { detectEmergency } from './emergency-detector';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

const AI_TIMEOUT_MS = 12_000;
const FALLBACK_MESSAGE = "Sorry, I'm having a moment. Could you repeat that for me?";

export interface AIResponse {
  message: string;
  isJobReady: boolean;
  extractedJobData?: Partial<ExtractedJobData>;
  emergencyDetected: boolean;
  emergencyScore: number;
  requiresHumanTakeover: boolean;
  safetyInstructions?: string[];
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
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

  let rawResponse: string;
  try {
    const completion = await withTimeout(
      getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
      AI_TIMEOUT_MS,
      'OpenAI chat completion',
    );
    rawResponse = completion.choices[0]?.message?.content ?? FALLBACK_MESSAGE;
  } catch (err) {
    console.error(JSON.stringify({
      ts: new Date().toISOString(),
      ctx: 'ai-orchestrator',
      msg: 'OpenAI call failed',
      err: err instanceof Error ? err.message : String(err),
    }));
    return {
      message: FALLBACK_MESSAGE,
      isJobReady: false,
      emergencyDetected: emergency.isEmergency,
      emergencyScore: emergency.emergencyScore,
      requiresHumanTakeover: false,
      safetyInstructions: emergency.safetyInstructions.length > 0 ? emergency.safetyInstructions : undefined,
    };
  }

  // Parse job_ready block
  let isJobReady = false;
  let extractedJobData: Partial<ExtractedJobData> | undefined;
  const jobReadyMatch = rawResponse.match(/```job_ready\n([\s\S]+?)\n```/);
  if (jobReadyMatch) {
    try {
      extractedJobData = JSON.parse(jobReadyMatch[1]) as Partial<ExtractedJobData>;
      isJobReady = true;
    } catch {
      console.warn(JSON.stringify({ ts: new Date().toISOString(), ctx: 'ai-orchestrator', msg: 'Failed to parse job_ready JSON' }));
    }
  }

  const cleanMessage = rawResponse.replace(/```job_ready[\s\S]+?```/g, '').trim();
  const requiresHumanTakeover = emergency.riskLevel === 'LIFE_THREATENING' && context.turnCount > 3;

  return {
    message: cleanMessage || FALLBACK_MESSAGE,
    isJobReady,
    extractedJobData: isJobReady ? extractedJobData : undefined,
    emergencyDetected: emergency.isEmergency,
    emergencyScore: emergency.emergencyScore,
    requiresHumanTakeover,
    safetyInstructions: emergency.safetyInstructions.length > 0 ? emergency.safetyInstructions : undefined,
  };
}

export async function generateJobSummary(context: ConversationContext): Promise<string> {
  const transcript = context.messages
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  try {
    const completion = await withTimeout(
      getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: `Based on this conversation, write a concise job description for a tradie (2-3 sentences, professional tone):\n\n${transcript}`,
        }],
        max_tokens: 150,
        temperature: 0.5,
      }),
      AI_TIMEOUT_MS,
      'generateJobSummary',
    );
    return completion.choices[0]?.message?.content ?? 'Emergency service required.';
  } catch {
    return 'Emergency home service required — details gathered via voice booking.';
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const file = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
  const response = await withTimeout(
    getOpenAI().audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
      prompt: 'Australian emergency home services. Trade terms: plumber, electrician, locksmith, HVAC.',
    }),
    30_000,
    'transcribeAudio',
  );
  return response.text;
}
