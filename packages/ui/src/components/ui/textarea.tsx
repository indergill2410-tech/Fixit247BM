'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, autoResize = false, rows = 3, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize && resolvedRef && 'current' in resolvedRef && resolvedRef.current) {
          resolvedRef.current.style.height = 'auto';
          resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`;
        }
        onChange?.(e);
      },
      [autoResize, resolvedRef, onChange],
    );

    return (
      <div className="flex flex-col gap-1">
        <textarea
          rows={rows}
          className={cn(
            'flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            'resize-none',
            autoResize && 'overflow-hidden',
            error && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          ref={resolvedRef}
          onChange={handleChange}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
