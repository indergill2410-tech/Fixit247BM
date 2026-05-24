'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { toast } from 'sonner';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { useRealTimeChat } from '@/lib/socket/hooks';
import type { MessagePayload } from '@fixit247/realtime';

interface ChatWindowProps {
  jobId: string;
  currentUserId: string;
  currentUserName: string;
  participantName: string;
}

export function ChatWindow({ jobId, currentUserId, currentUserName, participantName }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const { messages, setMessages, typingUsers, sendTypingStart, sendTypingStop } = useRealTimeChat(jobId);

  // Load message history
  useEffect(() => {
    fetch(`/api/messages/${jobId}`)
      .then((r) => r.json())
      .then((data: { messages: MessagePayload[] }) => {
        setMessages(data.messages);
      })
      .catch(() => toast.error('Could not load messages'))
      .finally(() => { setLoading(false); });
  }, [jobId, setMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = useCallback((val: string) => {
    setInput(val);
    sendTypingStart();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(sendTypingStop, 2000);
  }, [sendTypingStart, sendTypingStop]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput('');
    sendTypingStop();

    // Optimistic update
    const optimistic: MessagePayload = {
      id: `opt_${Date.now()}`,
      jobId, senderId: currentUserId, senderName: currentUserName,
      senderRole: 'CUSTOMER', content, type: 'TEXT', isSystem: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`/api/messages/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'TEXT' }),
      });
      if (!res.ok) throw new Error('Send failed');
      const { message } = await res.json() as { message: MessagePayload };
      // Replace optimistic with real message
      setMessages((prev) => prev.map((m) => m.id === optimistic.id ? message : m));
    } catch {
      toast.error('Message failed to send');
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  }

  // Mark messages as read when window is visible
  useEffect(() => {
    const unread = messages.filter((m) => m.senderId !== currentUserId);
    if (unread.length > 0) {
      void fetch(`/api/messages/${jobId}/read`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    }
  }, [messages, jobId, currentUserId]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-gray-50 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {participantName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{participantName}</p>
          <p className="text-xs text-green-500">Active on this job</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-gray-300" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No messages yet. Say hello to {participantName}!
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              type={msg.type}
              mediaUrl={msg.mediaUrl}
              isOwn={msg.senderId === currentUserId}
              isSystem={msg.isSystem}
              senderName={msg.senderName || participantName}
              createdAt={msg.createdAt}
            />
          ))
        )}

        <AnimatePresence>
          <TypingIndicator users={typingUsers.filter((u) => u.userId !== currentUserId)} />
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex items-end gap-2 border-t bg-white p-3">
        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => { handleInputChange(e.target.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(e); } }}
            placeholder={`Message ${participantName}…`}
            rows={1}
            className="w-full resize-none rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            style={{ maxHeight: 120 }}
          />
        </div>
        <Button type="submit" size="icon" disabled={!input.trim() || sending} className="shrink-0">
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </form>
    </div>
  );
}
