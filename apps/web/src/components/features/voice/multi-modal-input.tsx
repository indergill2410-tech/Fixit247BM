'use client';

import { useState, useRef } from 'react';
import { Camera, Mic, MicOff, X, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onComplete: (data: { description: string; images: File[]; audioTranscript?: string; emergencyScore?: number }) => void;
}

export function MultiModalInput({ onComplete }: Props) {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emergencyScore, setEmergencyScore] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 4);
    setImages((prev) => [...prev, ...files].slice(0, 4));
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => { t.stop(); });
        setTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', blob, 'audio.webm');
          const res = await fetch('/api/voice/transcribe', { method: 'POST', body: formData });
          const data = await res.json() as { transcript?: string; emergency?: { score: number } };
          if (data.transcript) {
            const transcript = data.transcript;
            setTranscript(transcript);
            setDescription((prev) => prev ? `${prev} ${transcript}` : transcript);
            setEmergencyScore(data.emergency?.score ?? 0);
          }
        } catch { toast.error('Transcription failed'); }
        finally { setTranscribing(false); }
      };
      recorder.start();
      setIsRecording(true);
    } catch { toast.error('Microphone access denied'); }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function handleSubmit() {
    if (!description.trim()) { toast.error('Please describe the issue'); return; }
    onComplete({ description, images, audioTranscript: transcript || undefined, emergencyScore: emergencyScore || undefined });
  }

  return (
    <div className="space-y-4">
      {/* Emergency indicator */}
      {emergencyScore >= 60 && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <AlertTriangle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">This sounds urgent — we'll prioritise your request.</p>
        </div>
      )}

      {/* Voice input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Describe the issue</label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); }}
            placeholder="E.g. My toilet is overflowing and water is coming through the floor..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none focus:border-red-300 resize-none"
          />
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`absolute right-3 top-3 rounded-lg p-1.5 transition-colors ${isRecording ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {transcribing ? <Loader2 size={16} className="animate-spin" /> : isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </div>
        {isRecording && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />Recording...</p>}
      </div>

      {/* Image upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Add photos (optional)</label>
        <div className="flex flex-wrap gap-2">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative h-20 w-20">
              <img src={src} alt="" className="h-20 w-20 rounded-xl object-cover border border-gray-200" />
              <button onClick={() => { removeImage(i); }} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
                <X size={10} />
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <button onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors">
              <Camera size={20} />
              <span className="text-[10px]">Add photo</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple capture="environment" onChange={handleImageSelect} className="hidden" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-xl bg-red-600 py-3.5 font-bold text-white hover:bg-red-700 transition-colors"
      >
        {emergencyScore >= 60 ? '🚨 Dispatch Emergency Help' : 'Find a Tradie Now'}
      </button>
    </div>
  );
}
