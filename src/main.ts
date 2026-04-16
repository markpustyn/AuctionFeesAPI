import { NestFactory } from '@nestjs/core';
import { FeesModule } from './app.module.js';


async function bootstrap() {
  const app = await NestFactory.create(FeesModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
