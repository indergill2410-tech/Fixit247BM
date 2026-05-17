import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (getOpenAI() as never)[prop as keyof OpenAI];
  },
});

export const AI_MODELS = {
  fast: 'gpt-4o-mini',
  balanced: 'gpt-4o',
  advanced: 'gpt-4o',
  smart: 'gpt-4o',
} as const;
