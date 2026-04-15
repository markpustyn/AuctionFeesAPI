import { Module } from '@nestjs/common';
import { FeesController } from './fees/fees.controller';
import { FeesService } from './app.controller';

@Module({
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}