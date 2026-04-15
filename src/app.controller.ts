import { Injectable } from '@nestjs/common';
import { copartCalculateTotal } from './fees/utils/copart.utils';
import { FeeProfileDto } from './fees/dto/fee-profile.dto';
import { estimateInlandTowing } from './fees/utils/geo.utils';

@Injectable()
export class FeesService {
  getQuote(dto: FeeProfileDto) {
    return copartCalculateTotal({
      bidAmount: dto.bidAmount,
      bidType: dto.bidType,
      bidPay: dto.bidPay,
      bidVehicle: dto.bidVehicle,
      gateFee: 95,
      environmentalFee: 20,
      titleHandelingFee: 15,
    });
  }

  getTowing(dto: FeeProfileDto) {
    return estimateInlandTowing({
      fromState: dto.fromState,
      fromCity: dto.fromCity,
    });
  }

  getFullQuote(dto: FeeProfileDto) {
    return {
      quote: this.getQuote(dto),
      towing: this.getTowing(dto),
    };
  }
}