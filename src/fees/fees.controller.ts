import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { FeesService } from '../app.controller.js';
import { ApiKeyGuard } from '../auth/api-key.guard.js';
import { FeeProfileDto } from './dto/fee-profile.dto.js';


@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  create(@Body() dto: FeeProfileDto) {
    return this.feesService.getFullQuote(dto);
  }

  @UseGuards(ApiKeyGuard)
  @Post('auth')
  getQuote(@Req() req: any) {
    return {
      message: 'Authorized',
      client: req.client.name,
    };
  }
}