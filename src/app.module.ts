import { Module } from '@nestjs/common';
import { FeesController } from './fees/fees.controller.js';
import { FeesService } from './app.controller.js';
import { PrismaService } from "./prisma.service.js"; 
import { UserService } from "./user.service.js"; 
import { PostService } from "./post.service.js"; 
@Module({
  controllers: [FeesController],
  providers: [FeesService, PrismaService, UserService, PostService],
})
export class FeesModule {}