'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Progress } from './progress';

export interface FileWithPreview {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

export interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10 MB default
  multiple = false,
  onUpload,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<FileWithPreview[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateAndAdd = React.useCallback(
    (incoming: File[]) => {
      const limited = multiple ? incoming : incoming.slice(0, 1);
      const newEntries: FileWithPreview[] = limited.map((file) => {
        const tooBig = file.size > maxSize;
        const entry: FileWithPreview = {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          status: tooBig ? 'error' : 'pending',
          progress: 0,
          ...(tooBig && { error: `File exceeds ${formatBytes(maxSize)} limit` }),
        };
        if (isImage(file) && !tooBig) {
          entry.preview = URL.createObjectURL(file);
        }
        return entry;
      });

      setFiles((prev) => {
        if (!multiple) {
          prev.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
          return newEntries;
        }
        return [...prev, ...newEntries];
      });

      const valid = newEntries.filter((e) => e.status === 'pending').map((e) => e.file);
      if (valid.length > 0) {
        // Simulate upload progress
        newEntries
          .filter((e) => e.status === 'pending')
          .forEach((entry) => {
            simulateUpload(entry.id);
          });
        onUpload(valid);
      }
    },
    [maxSize, multiple, onUpload],
  );

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'uploading' as const } : f)),
    );
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        clearInterval(tick);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: 'done' as const, progress: 100 } : f)),
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f)),
        );
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    validateAndAdd(dropped);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    validateAndAdd(Array.from(e.target.files));
    e.target.value = '';
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Dropzone */}
      <motion.div
        className={cn(
          'relative flex flex-col items-center justify-center gap-3',
          'rounded-2xl border-2 border-dashed px-6 py-10',
          'cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-brand-500 bg-blue-50/60 scale-[1.01]'
            : 'border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-blue-50/30',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
            isDragging ? 'bg-brand-100 text-brand-600' : 'bg-gray-200 text-gray-500',
          )}
        >
          <Upload className="h-5 w-5" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            <span className="text-brand-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {accept ? accept.replace(/,/g, ', ') : 'Any file type'} — max {formatBytes(maxSize)}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />
      </motion.div>

      {/* File list */}
      <AnimatePresence initial={false}>
        {files.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-start gap-3 rounded-xl border p-3',
              entry.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white',
            )}
          >
            {/* Preview / Icon */}
            <div className="shrink-0">
              {entry.preview ? (
                <img
                  src={entry.preview}
                  alt={entry.file.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">{entry.file.name}</p>
                {entry.status === 'done' && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                {entry.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />}
              </div>
              <p className="text-xs text-gray-400">{formatBytes(entry.file.size)}</p>

              {entry.status === 'uploading' && entry.progress !== undefined && (
                <Progress value={entry.progress} size="sm" variant="brand" />
              )}
              {entry.error && (
                <p className="text-xs text-red-600">{entry.error}</p>
              )}
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeFile(entry.id); }}
              className="shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
