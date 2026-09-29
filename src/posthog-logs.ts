import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchLogRecordProcessor,
  LogRecordProcessor,
  ReadWriteLogRecord,
} from '@opentelemetry/sdk-logs';
import { configuredHost, configuredProjectToken } from './posthog';

const loggerName = 'fees-api-posthog';

class DedicatedPostHogLogProcessor implements LogRecordProcessor {
  constructor(private readonly processor: BatchLogRecordProcessor) {}

  onEmit(logRecord: ReadWriteLogRecord): void {
    if (logRecord.instrumentationScope.name === loggerName) {
      this.processor.onEmit(logRecord);
    }
  }

  forceFlush(): Promise<void> {
    return this.processor.forceFlush();
  }

  shutdown(): Promise<void> {
    return this.processor.shutdown();
  }
}

const posthogLogger = logs.getLogger(loggerName);
let logSdk: NodeSDK | undefined;

if (configuredProjectToken && configuredHost) {
  const logExporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', configuredHost).toString(),
    headers: {
      Authorization: `Bearer ${configuredProjectToken}`,
    },
  });
  const logProcessor = new DedicatedPostHogLogProcessor(
    new BatchLogRecordProcessor({ exporter: logExporter }),
  );
  logSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'fees-api',
    }),
    logRecordProcessors: [logProcessor],
  });

  logSdk.start();
  posthogLogger.emit({
    severityText: 'INFO',
    body: 'PostHog log export initialized',
  });
}

export async function shutdownPostHogLogs() {
  await logSdk?.shutdown();
}

export function logFeeQuoteCalculated(attributes: {
  auction: string;
  bid_type: string;
  bid_payment: string;
  bid_vehicle: string;
  towing_requested: boolean;
}) {
  if (!configuredProjectToken || !configuredHost) {
    return;
  }

  posthogLogger.emit({
    severityText: 'INFO',
    body: 'Fee quote calculated',
    attributes,
  });
}
