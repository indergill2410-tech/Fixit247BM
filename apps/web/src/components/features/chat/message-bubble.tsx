'use client';

import { cn } from '@fixit247/ui/src/lib/utils';
import { CheckCheck, Check, Image as ImageIcon, FileText } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  type: string;
  mediaUrl?: string | null;
  isOwn: boolean;
  isSystem: boolean;
  senderName: string;
  status?: string;
  createdAt: string;
}

function DeliveryIcon({ status }: { status?: string }) {
  if (status === 'READ') return <CheckCheck size={12} className="text-blue-400" />;
  if (status === 'DELIVERED') return <CheckCheck size={12} className="text-gray-400" />;
  return <Check size={12} className="text-gray-400" />;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ content, type, mediaUrl, isOwn, isSystem, senderName, status, createdAt }: MessageBubbleProps) {
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="rounded-full bg-gray-100 px-4 py-1 text-xs text-gray-500">{content}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2 mb-3', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar dot */}
      {!isOwn && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {senderName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={cn('max-w-[75%]', isOwn ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
        {!isOwn && <p className="text-[11px] font-medium text-gray-500 px-1">{senderName}</p>}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm',
            isOwn
              ? 'rounded-tr-sm bg-brand-600 text-white'
              : 'rounded-tl-sm bg-white border text-gray-800 shadow-sm'
          )}
        >
          {type === 'IMAGE' && mediaUrl ? (
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              <img src={mediaUrl} alt="Job photo" className="max-w-[200px] rounded-lg" />
            </a>
          ) : type === 'FILE' && mediaUrl ? (
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
              <FileText size={16} />
              {content}
            </a>
          ) : type === 'VOICE' ? (
            <div className="flex items-center gap-2">
              <ImageIcon size={14} />
              <span className="italic text-sm">Voice note</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{content}</p>
          )}
        </div>

        <div className={cn('flex items-center gap-1 px-1', isOwn ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-[10px] text-gray-400">{formatTime(createdAt)}</span>
          {isOwn && <DeliveryIcon status={status} />}
        </div>
      </div>
    </div>
  );
}
