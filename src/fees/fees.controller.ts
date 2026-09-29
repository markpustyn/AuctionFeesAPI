import { Controller, Body, Post } from '@nestjs/common';
import { FeeProfileDto } from './dto/fee-profile.dto';
import { FeesService } from 'src/app.controller';
import { posthog } from '../posthog';
import { logFeeQuoteCalculated } from '../posthog-logs';

@Controller('')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post()
  create(@Body() dto: FeeProfileDto) {
    const quote = this.feesService.getFullQuote(dto);

    const logAttributes = {
      auction: dto.auction,
      bid_type: dto.bidType,
      bid_payment: dto.bidPay,
      bid_vehicle: dto.bidVehicle,
      towing_requested: Boolean(dto.fromState && dto.fromCity),
    };

    posthog?.capture({
      event: 'fee_quote_calculated',
      properties: logAttributes,
    });
    logFeeQuoteCalculated(logAttributes);

    return quote;
  }
}
