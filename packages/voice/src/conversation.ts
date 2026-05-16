export type ConversationTurn = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type ExtractedJobData = {
  issue: string | null;
  tradeCategory: string | null;
  suburb: string | null;
  address: string | null;
  propertyType: 'HOUSE' | 'APARTMENT' | 'COMMERCIAL' | null;
  isEmergency: boolean;
  urgencyScore: number;
  safetyRisk: boolean;
  additionalNotes: string | null;
};

export type ConversationContext = {
  sessionId: string;
  messages: ConversationTurn[];
  extractedData: Partial<ExtractedJobData>;
  turnCount: number;
  isComplete: boolean;
  isEmergency: boolean;
};

export const SYSTEM_PROMPT = `You are Ally, the AI emergency booking assistant for Fixit 24/7 — Australia's #1 emergency home services platform. You help customers book verified tradies quickly, especially in emergencies.

Your personality:
- Calm, warm, and professional — like a trusted Australian friend who knows tradies
- Reassuring in emergencies — never panic, always guide
- Concise — never more than 2-3 sentences per response
- Empathetic — acknowledge the stressful situation briefly, then get to solutions fast

Your job:
1. Understand what's wrong (the issue)
2. Identify the trade needed (plumber, electrician, locksmith, etc.)
3. Get their location (suburb or address)
4. Assess urgency and any safety concerns
5. Confirm and create the job

Guidelines:
- If it sounds like an emergency (flooding, sparks, gas, lockout), say: "That sounds urgent — I'm going to get someone to you as fast as possible. First, [safety tip if needed]."
- Ask ONE question at a time — never multiple questions in one message
- After 4-5 turns, you should have enough to confirm the job
- Use casual Australian language: "mate", "no worries", "sorted"
- NEVER say you're an AI unless directly asked

Safety rules:
- If gas leak detected: immediately say "Please leave the building now and call 000 if you smell strong gas. I'm dispatching an emergency gas technician."
- If fire: "Please call 000 immediately and evacuate. Your safety is the priority."
- If flooding: "Turn off your main water supply first — it's usually at the front of the property."

When you have enough info (issue + suburb at minimum), respond with a JSON block at the end:
\`\`\`job_ready
{"issue": "...", "tradeCategory": "PLUMBING|ELECTRICAL|LOCKSMITH|HVAC|ROOFING|GLAZING|PEST_CONTROL|CARPENTRY|PLASTERING|GENERAL_MAINTENANCE", "suburb": "...", "isEmergency": true|false, "urgencyScore": 0-100}
\`\`\``;

export function extractJobDataFromConversation(messages: ConversationTurn[]): Partial<ExtractedJobData> {
  const fullText = messages.map((m) => m.content).join(' ').toLowerCase();

  // Extract suburb mentions (simplified — production would use NER)
  const suburbPattern = /(?:in|at|near|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;
  const suburbMatches = [...messages.filter(m => m.role === 'user').map(m => m.content).join(' ').matchAll(suburbPattern)];
  const suburb = suburbMatches.length > 0 ? suburbMatches[suburbMatches.length - 1]?.[1] ?? null : null;

  // Extract trade from content
  const TRADE_KEYWORDS: Record<string, string> = {
    'plumb|pipe|toilet|water|drain|tap|hot water|leak': 'PLUMBING',
    'electr|power|light|circuit|fuse|sparks|wiring': 'ELECTRICAL',
    'lock|key|locked out|door|security': 'LOCKSMITH',
    'air con|hvac|heating|cooling|ac ': 'HVAC',
    'roof|ceiling|leak|tiles|gutter': 'ROOFING',
    'window|glass|glazing|broken window': 'GLAZING',
    'pest|termite|cockroach|rat|mouse|ant': 'PEST_CONTROL',
  };

  let tradeCategory: string | null = null;
  for (const [keywords, trade] of Object.entries(TRADE_KEYWORDS)) {
    if (new RegExp(keywords).test(fullText)) { tradeCategory = trade; break; }
  }

  return { suburb, tradeCategory };
}

export function shouldAskFollowUp(context: ConversationContext): string | null {
  const { extractedData, turnCount } = context;

  if (turnCount < 1) return null; // Wait for user to describe issue first

  if (!extractedData.suburb && turnCount >= 1) {
    return 'Whereabouts in Australia are you located? Just the suburb is fine.';
  }
  if (!extractedData.propertyType && turnCount >= 2) {
    return 'Is this at a house or an apartment?';
  }
  if (extractedData.isEmergency && !extractedData.safetyRisk && turnCount >= 2) {
    return extractedData.tradeCategory === 'PLUMBING'
      ? 'Is water still actively flowing, or has it slowed down?'
      : extractedData.tradeCategory === 'ELECTRICAL'
      ? 'Have you been able to turn off the power at the main switchboard?'
      : extractedData.tradeCategory === 'LOCKSMITH'
      ? 'Are you completely locked out, or is there another way to get in?'
      : null;
  }
  return null;
}
