type Level = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  ts: string;
  level: Level;
  ctx: string;
  msg: string;
  data?: unknown;
}

function emit(level: Level, ctx: string, msg: string, data?: unknown): void {
  const entry: LogEntry = { ts: new Date().toISOString(), level, ctx, msg };
  if (data !== undefined) entry.data = data;
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info:  (ctx: string, msg: string, data?: unknown) => emit('info',  ctx, msg, data),
  warn:  (ctx: string, msg: string, data?: unknown) => emit('warn',  ctx, msg, data),
  error: (ctx: string, msg: string, data?: unknown) => emit('error', ctx, msg, data),
  debug: (ctx: string, msg: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') emit('debug', ctx, msg, data);
  },
};
