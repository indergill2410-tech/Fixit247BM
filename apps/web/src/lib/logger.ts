/* eslint-disable no-console */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type OtelEmitter = (level: LogLevel, message: string, attrs?: Record<string, unknown>) => void;
let _otelEmit: OtelEmitter | null = null;
/** Called once from instrumentation.ts on the Node.js runtime to wire in PostHog OTel logs. */
export function setOtelEmitter(fn: OtelEmitter): void { _otelEmit = fn; }

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = new Set([
  'password', 'token', 'secret', 'key', 'authorization', 'cookie',
  'creditCard', 'cardNumber', 'cvv', 'ssn', 'taxId',
]);

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : v,
    ]),
  );
}

function normalizeMeta(meta: unknown): Record<string, unknown> | undefined {
  if (meta === undefined || meta === null) return undefined;
  if (meta instanceof Error) return { message: meta.message, stack: meta.stack, name: meta.name };
  if (typeof meta === 'object') return meta as Record<string, unknown>;
  return { value: meta };
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (process.env.NODE_ENV === 'test') return;

  const normalized = normalizeMeta(meta);
  const isDev = process.env.NODE_ENV !== 'production';
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(normalized ? redact(normalized) : {}),
  };

  if (isDev) {
    const prefix = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level];
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(`${prefix} [${entry.timestamp}] ${message}`, meta ?? '');
  } else {
    // Structured JSON for log aggregators (Datadog, CloudWatch, Render logs)
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(JSON.stringify(entry));
    _otelEmit?.(level, message, normalized);
  }
}

export const logger = {
  debug: (msg: string, meta?: unknown) => { log('debug', msg, meta); },
  info: (msg: string, meta?: unknown) => { log('info', msg, meta); },
  warn: (msg: string, meta?: unknown) => { log('warn', msg, meta); },
  error: (msg: string, meta?: unknown) => { log('error', msg, meta); },
};
