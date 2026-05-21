import OpenAI from 'openai';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}
const openai = new Proxy({} as OpenAI, { get(_t, p) { return (getOpenAI() as never)[p as keyof OpenAI]; } });

export interface SuburbContentInput {
  trade: string;        // e.g. "PLUMBING"
  tradeName: string;    // e.g. "Plumber"
  suburb: string;       // e.g. "Parramatta"
  state: string;        // e.g. "NSW"
  isEmergency: boolean;
}

export interface GeneratedSEOContent {
  intro: string;
  whyChooseUs: string;
  localContext: string;
  emergencyTips: string[];
  pricingGuide: string;
  beforeTradieArrives: string[];
  faqs: { question: string; answer: string }[];
}

export async function generateSuburbContent(input: SuburbContentInput): Promise<GeneratedSEOContent> {
  const { trade, tradeName, suburb, state, isEmergency } = input;
  const serviceType = isEmergency ? 'emergency' : 'same-day';

  const prompt = `You are a local Australian home services content writer for Fixit 24/7, an emergency tradie platform.

Write SEO-optimised content for a ${serviceType} ${tradeName.toLowerCase()} service page in ${suburb}, ${state}, Australia.

Return a JSON object with these exact fields:
{
  "intro": "2-3 sentences introducing emergency/same-day ${tradeName.toLowerCase()} services in ${suburb}. Mention verified professionals, fast response, and local knowledge. Include the suburb name naturally.",
  "whyChooseUs": "2 sentences on why Fixit 24/7 is the best choice for ${tradeName.toLowerCase()} in ${suburb}. Focus on trust, speed, licensing.",
  "localContext": "1-2 sentences of locally relevant context about ${suburb}, ${state} — mention local characteristics that affect ${trade.toLowerCase()} needs (e.g. older housing stock, weather patterns, typical issues).",
  "emergencyTips": ["tip 1", "tip 2", "tip 3", "tip 4"],
  "pricingGuide": "2 sentences about typical ${tradeName.toLowerCase()} pricing in ${suburb}. Mention upfront pricing, no hidden fees.",
  "beforeTradieArrives": ["action 1", "action 2", "action 3"],
  "faqs": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}

Rules:
- Sound natural and locally relevant, not generic
- Include ${suburb} name in intro and localContext
- Emergency tips should be practical safety advice
- FAQs should answer real questions a ${suburb} homeowner would have
- Keep each field concise but informative
- Use Australian English (e.g. "kerb" not "curb", "licence" not "license")`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1200,
  });

  const content = response.choices[0]?.message.content ?? '{}';
  return JSON.parse(content) as GeneratedSEOContent;
}

export async function generateBlogArticle(topic: string, suburb?: string): Promise<{ title: string; content: string; metaDescription: string }> {
  const locationContext = suburb ? ` for ${suburb} homeowners` : ' for Australian homeowners';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Write a helpful, SEO-optimised blog article${locationContext} about: "${topic}".

Return JSON with:
{
  "title": "SEO-optimised article title (60 chars max)",
  "metaDescription": "Meta description (155 chars max)",
  "content": "Full article in markdown format, 600-900 words. Include practical tips, safety advice, and when to call a professional. Use Australian English."
}`,
    }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 2000,
  });

  const blogContent = response.choices[0]?.message.content ?? '{}';
  return JSON.parse(blogContent) as Record<string, unknown>;
}
