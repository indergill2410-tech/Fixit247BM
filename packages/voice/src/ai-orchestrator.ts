import OpenAI from 'openai';
import { SYSTEM_PROMPT, ExtractedJobData, ConversationContext } from './conversation';
import { detectEmergency } from './emergency-detector';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
  return _openai;
}
const openai = new Proxy({} as OpenAI, { get(_t, p) { return (getOpenAI() as never)[p as keyof OpenAI]; } });

export interface AIResponse {
  message: string;
  isJobReady: boolean;
  extractedJobData?: Partial<ExtractedJobData>;
  emergencyDetected: boolean;
  emergencyScore: number;
  requiresHumanTakeover: boolean;
  safetyInstructions?: string[];
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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 300,
    temperature: 0.7,
  });

  const rawResponse = response.choices[0]?.message.content ?? '';

  let isJobReady = false;
  let extractedJobData: Partial<ExtractedJobData> | undefined;
  const jobReadyMatch = rawResponse.match(/```job_ready\n([\s\S]+?)\n```/);
  if (jobReadyMatch?.[1]) {
    try {
      extractedJobData = JSON.parse(jobReadyMatch[1]) as Partial<ExtractedJobData>;
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
