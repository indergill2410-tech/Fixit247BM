type LogLevel = 'debug' | 'info' | 'warn' | 'error';

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

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'test') return;

  const isDev = process.env.NODE_ENV !== 'production';
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? redact(meta) : {}),
  };

  if (isDev) {
    const prefix = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level];
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(`${prefix} [${entry.timestamp}] ${message}`, meta ?? '');
  } else {
    // Structured JSON for log aggregators (Datadog, CloudWatch, Render logs)
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(JSON.stringify(entry));
  }
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => { log('debug', msg, meta); },
  info: (msg: string, meta?: Record<string, unknown>) => { log('info', msg, meta); },
  warn: (msg: string, meta?: Record<string, unknown>) => { log('warn', msg, meta); },
  error: (msg: string, meta?: Record<string, unknown>) => { log('error', msg, meta); },
};
