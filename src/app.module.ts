import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeesController } from './fees/fees.controller';

@Module({
  imports: [],
  controllers: [AppController, FeesController],
  providers: [AppService],
})
export class AppModule {}
