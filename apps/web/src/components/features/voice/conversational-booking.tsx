'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, AlertTriangle, CheckCircle, Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { VoiceWaveform } from './voice-waveform';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ExtractedJobData {
  issue?: string;
  tradeCategory?: string;
  suburb?: string;
  isEmergency?: boolean;
  urgencyScore?: number;
}

interface Props {
  onJobCreated?: (jobData: ExtractedJobData) => void;
  initialMessage?: string;
  compact?: boolean;
}

const EMERGENCY_OPENERS = [
  'My toilet is overflowing',
  'No power after sparks',
  'Locked out of my house',
  'Water leaking through ceiling',
  'Burst pipe flooding',
];

export function ConversationalBooking({ onJobCreated, initialMessage, compact = false }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "G'day! I'm Ally, your emergency booking assistant. What's happening at your place?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isJobReady, setIsJobReady] = useState(false);
  const [jobData, setJobData] = useState<ExtractedJobData | null>(null);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [safetyInstructions, setSafetyInstructions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      setTimeout(() => sendMessage(initialMessage), 500);
    }
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/voice/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();

      setSessionId(data.sessionId);

      const aiMessage: Message = { role: 'assistant', content: data.message, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);

      if (data.emergencyDetected && !emergencyDetected) {
        setEmergencyDetected(true);
        if (data.safetyInstructions?.length > 0) {
          setSafetyInstructions(data.safetyInstructions);
        }
      }

      if (data.isJobReady && data.extractedJobData) {
        setIsJobReady(true);
        setJobData(data.extractedJobData);
        onJobCreated?.(data.extractedJobData);
      }
    } catch {
      toast.error('Connection error — please try again');
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        await transcribeAndSend(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Microphone access denied');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  async function transcribeAndSend(audioBlob: Blob) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      const res = await fetch('/api/voice/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.transcript) {
        await sendMessage(data.transcript);
      }
    } catch {
      toast.error('Transcription failed — please type your message');
    } finally {
      setLoading(false);
    }
  }

  if (isJobReady && jobData) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
        <CheckCircle size={40} className="mx-auto mb-3 text-green-500" />
        <h3 className="text-lg font-bold text-green-900 mb-1">Job Created!</h3>
        <p className="text-sm text-green-700 mb-4">
          {jobData.isEmergency ? 'Emergency dispatch triggered — ' : 'Booking confirmed — '}
          a {jobData.tradeCategory?.toLowerCase() ?? 'tradie'} is being matched
          {jobData.suburb ? ` in ${jobData.suburb}` : ''}.
        </p>
        <div className="rounded-xl bg-white p-4 text-left text-sm border border-green-100">
          <p className="text-gray-500 mb-1">Issue</p>
          <p className="font-medium text-gray-900">{jobData.issue ?? 'Service request'}</p>
          {jobData.suburb && <><p className="text-gray-500 mt-2 mb-1">Location</p><p className="font-medium text-gray-900">{jobData.suburb}</p></>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col rounded-2xl border ${emergencyDetected ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} overflow-hidden ${compact ? 'h-80' : 'h-[500px]'}`}>
      {/* Emergency banner */}
      {emergencyDetected && safetyInstructions.length > 0 && (
        <div className="bg-red-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} />
            <p className="text-xs font-bold uppercase tracking-wide">Safety First</p>
          </div>
          <p className="text-xs text-red-100">{safetyInstructions[0]}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">A</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-gray-900 text-white rounded-br-sm'
                : emergencyDetected ? 'bg-white border border-red-200 text-gray-800 rounded-bl-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">A</div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
              <div className="flex gap-1">
                {[0,1,2].map((i) => <div key={i} className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {EMERGENCY_OPENERS.slice(0, 3).map((opener) => (
            <button key={opener} onClick={() => sendMessage(opener)}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 transition-colors">
              {opener}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        {isRecording && (
          <div className="mb-2 flex items-center justify-center gap-2 text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-medium">Recording — tap mic to stop</span>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isRecording ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder={emergencyDetected ? 'Describe the situation...' : "What's happening?"}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
