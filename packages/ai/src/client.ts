import OpenAI from 'openai';

const apiKey = process.env['OPENAI_API_KEY'];
if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

export const openai = new OpenAI({ apiKey });

export const AI_MODELS = {
  fast: 'gpt-4o-mini',
  balanced: 'gpt-4o',
  advanced: 'gpt-4o',
} as const;
