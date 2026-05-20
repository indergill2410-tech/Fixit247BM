import { openai } from './client';

export interface TranscriptionResult {
  text: string;
  duration: number;
  language: string;
}

export async function transcribeVoiceNote(
  audioBuffer: Buffer,
  filename: string = 'voice-note.webm'
): Promise<TranscriptionResult> {
  const file = new File([audioBuffer.buffer as ArrayBuffer], filename, {
    type: filename.endsWith('.mp3') ? 'audio/mpeg' : 'audio/webm',
  });

  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'en',
    response_format: 'verbose_json',
  });

  return {
    text: response.text,
    duration: (response as { duration?: number }).duration ?? 0,
    language: (response as { language?: string }).language ?? 'en',
  };
}

export function sanitizeTranscript(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(um|uh|like|so|yeah|okay|right),?\s*/gi, '')
    .replace(/\s+(um|uh|like)\s+/gi, ' ');
}
