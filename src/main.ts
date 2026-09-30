import 'dotenv/config';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { PostHogInterceptor } from 'posthog-node/nestjs';
import { FeesModule } from './app.module';
import { shutdownPostHogLogs } from './posthog-logs';
import { posthog } from './posthog';

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
