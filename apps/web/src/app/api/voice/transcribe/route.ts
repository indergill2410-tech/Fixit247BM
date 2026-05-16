import { NextResponse } from 'next/server';
import { transcribeAudio } from '@fixit247/voice';
import { detectEmergency } from '@fixit247/voice';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    if (!audioFile) return NextResponse.json({ error: 'No audio file' }, { status: 400 });

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const transcript = await transcribeAudio(buffer);
    const emergency = detectEmergency(transcript);

    return NextResponse.json({
      transcript,
      emergency: {
        detected: emergency.isEmergency,
        score: emergency.emergencyScore,
        riskLevel: emergency.riskLevel,
        tradeCategory: emergency.tradeCategory,
        safetyInstructions: emergency.safetyInstructions,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
