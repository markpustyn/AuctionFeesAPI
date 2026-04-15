import { Controller, Body, Get, Post } from '@nestjs/common';
import { FeeProfileDto } from './dto/fee-profile.dto';
import { FeesService } from 'src/app.controller';

@Controller('')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post()
  create(@Body() dto: FeeProfileDto) {
    return this.feesService.getFullQuote(dto);
  }
}