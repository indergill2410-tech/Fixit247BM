import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { SeverityNumber } from '@opentelemetry/api-logs';
import type { Logger, AnyValueMap } from '@opentelemetry/api-logs';

let _logger: Logger | null = null;

export function getOtelLogger(): Logger | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  if (!_logger) {
    const exporter = new OTLPLogExporter({
      url: `${process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'}/otlp/v1/logs`,
      headers: { Authorization: `Bearer ${key}` },
    });
    const provider = new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'fixit247-web' }),
      processors: [new SimpleLogRecordProcessor(exporter)],
    });
    _logger = provider.getLogger('fixit247-web');
  }
  return _logger;
}

const SEVERITY: Record<string, { number: SeverityNumber; text: string }> = {
  debug: { number: SeverityNumber.DEBUG, text: 'DEBUG' },
  info:  { number: SeverityNumber.INFO,  text: 'INFO'  },
  warn:  { number: SeverityNumber.WARN,  text: 'WARN'  },
  error: { number: SeverityNumber.ERROR, text: 'ERROR' },
};

export function emitOtelLog(
  level: string,
  message: string,
  attributes?: Record<string, unknown>,
): void {
  const l = getOtelLogger();
  if (!l) return;
  const sev = SEVERITY[level] ?? SEVERITY.info;
  l.emit({
    severityNumber: sev.number,
    severityText: sev.text,
    body: message,
    attributes: attributes as AnyValueMap | undefined,
  });
}
