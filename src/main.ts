import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { PostHogInterceptor } from 'posthog-node/nestjs';
import { FeesModule } from './app.module';
import { shutdownPostHogLogs } from './posthog-logs';
import { posthog } from './posthog';

type AnalyticsRequest = Request & {
  user?: { id?: string | number };
};

@Catch()
class PostHogExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error && !(exception instanceof HttpException)) {
      try {
        posthog?.captureException(exception, 'server');
      } catch (error) {
        console.error('Failed to capture exception in PostHog:', error);
      }
    }

    super.catch(exception, host);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(FeesModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use((req: AnalyticsRequest, res: Response, next: NextFunction) => {
    const startedAt = performance.now();

    res.once('finish', () => {
      if (!posthog) return;

      try {
        const userId = req.user?.id;
        const distinctId = userId != null ? String(userId) : randomUUID();

        const successful = res.statusCode >= 200 && res.statusCode < 300;

        const properties = {
          method: req.method,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          route: req.route?.path ?? 'unmatched',
          status_code: res.statusCode,
          duration_ms: Math.round(performance.now() - startedAt),
          successful,
          environment: process.env.NODE_ENV ?? 'development',
          $process_person_profile: false,
        };

        posthog.capture({
          distinctId,
          event: 'api_request_completed',
          properties,
        });

        // Change "/" if your calculation endpoint uses another path.
        if (req.method === 'POST' && req.path === '/' && successful) {
          posthog.capture({
            distinctId,
            event: 'fee_quote_calculated',
            properties: {
              ...properties,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ...(typeof req.body?.auction === 'string'
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  { auction: req.body.auction }
                : {}),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ...(typeof req.body?.bidAmount === 'number'
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                  { bid_amount: req.body.bidAmount }
                : {}),
            },
          });
        }
      } catch (error) {
        console.error('Failed to capture API analytics:', error);
      }
    });

    next();
  });

  app.useGlobalFilters(new PostHogExceptionFilter(httpAdapter));

  if (posthog) {
    app.useGlobalInterceptors(new PostHogInterceptor(posthog));
  }

  let shuttingDown = false;

  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;

    try {
      await app.close();
    } catch (error) {
      console.error('Failed to close application:', error);
      process.exitCode = 1;
    } finally {
      const results = await Promise.allSettled([
        Promise.resolve().then(() => posthog?.shutdown()),
        Promise.resolve().then(() => shutdownPostHogLogs()),
      ]);

      for (const result of results) {
        if (result.status === 'rejected') {
          console.error('Failed to flush PostHog:', result.reason);
          process.exitCode = 1;
        }
      }
    }
  };

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exitCode = 1;
});
