import 'dotenv/config';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { FeesModule } from './app.module';
import { shutdownPostHogLogs } from './posthog-logs';
import { posthog } from './posthog';

@Catch()
class PostHogExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error && !(exception instanceof HttpException)) {
      posthog?.captureException(exception, 'server');
    }

    super.catch(exception, host);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(FeesModule);
  app.useGlobalFilters(
    new PostHogExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
  );

  const shutdown = async () => {
    await app.close();
    await Promise.all([posthog?.shutdown(), shutdownPostHogLogs()]);
  };
  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
