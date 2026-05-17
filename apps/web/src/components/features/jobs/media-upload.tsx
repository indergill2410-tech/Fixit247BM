'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Mic, MicOff, X, Loader2 } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { cn } from '@fixit247/ui/src/lib/utils';

interface MediaUploadProps {
  onImagesChange: (urls: string[]) => void;
  onVoiceTranscript: (text: string) => void;
  maxImages?: number;
  className?: string;
}

export function MediaUpload({ onImagesChange, onVoiceTranscript, maxImages = 4, className }: MediaUploadProps) {
  const [images, setImages] = React.useState<string[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [uploadingImages, setUploadingImages] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, maxImages - images.length);
    if (files.length === 0) return;
    setUploadingImages(true);
    // In production this would upload to Supabase Storage
    // For now create object URLs as placeholders
    const urls = files.map((f) => URL.createObjectURL(f));
    const newImages = [...images, ...urls].slice(0, maxImages);
    setImages(newImages);
    onImagesChange(newImages);
    setUploadingImages(false);
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    onImagesChange(next);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'voice-note.webm');
      const res = await fetch('/api/ai/transcribe', { method: 'POST', body: formData });
      if (res.ok) {
        const { transcript } = await res.json();
        onVoiceTranscript(transcript);
      }
    } catch {
      // Transcription failed silently
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Image uploads */}
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Photos (optional)</p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {images.map((url, idx) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-white/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                >
                  <X size={10} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/4 text-gray-500 hover:border-brand-400 hover:bg-brand-500/10 hover:text-brand-400 transition-colors"
            >
              {uploadingImages ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
              <span className="mt-1 text-xs">Add photo</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Voice recording */}
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Voice note (optional)</p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'outline'}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={cn('gap-2', isRecording && 'animate-pulse')}
          >
            {isRecording ? (
              <>
                <MicOff size={14} />
                Stop ({recordingSeconds}s)
              </>
            ) : isTranscribing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Transcribing…
              </>
            ) : (
              <>
                <Mic size={14} />
                Record voice
              </>
            )}
          </Button>
          <p className="text-xs text-gray-400">Describe the problem in your own words</p>
        </div>
      </div>
    </div>
  );
}
