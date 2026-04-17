import { Module } from '@nestjs/common';
import { FeesController } from './fees/fees.controller';
import { FeesService } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [FeesController],
  providers: [FeesService, 
{
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
  ],
    imports: [
     ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 70,
        },
      ],
    }),
  ],
})
export class FeesModule {}