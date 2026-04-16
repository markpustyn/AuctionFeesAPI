import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { copartCalculateTotal } from './fees/utils/copart.utils.js';
import { FeeProfileDto } from './fees/dto/fee-profile.dto.js';
import { iaaiCalcualteTotal } from './fees/utils/iaai.utils.js';
import { estimateInlandTowing } from './fees/utils/geo.utils.js';

@Injectable()
export class FeesService {
  getQuote(dto: FeeProfileDto) {
    if (!dto) {
      throw new BadRequestException('Request body is required');
    }

    if (dto.bidAmount === undefined || dto.bidAmount === null || Number.isNaN(Number(dto.bidAmount))) {
      throw new BadRequestException('bidAmount must be a valid number');
    }

    if (Number(dto.bidAmount) <= 0) {
      throw new BadRequestException('bidAmount must be greater than 0');
    }

    if (!dto.auction) {
      throw new BadRequestException('auction is required');
    }

    if (!dto.bidType) {
      throw new BadRequestException('bidType is required');
    }

    if (!dto.bidPay) {
      throw new BadRequestException('bidPay is required');
    }

    if (!dto.bidVehicle) {
      throw new BadRequestException('bidVehicle is required');
    }

    try {
      if (dto.auction === 'copart') {
        return copartCalculateTotal({
          bidAmount: Number(dto.bidAmount),
          bidType: dto.bidType,
          bidPay: dto.bidPay,
          bidVehicle: dto.bidVehicle,
          gateFee: 95,
          environmentalFee: 20,
          titleHandelingFee: 15,
        });
      }

      if (dto.auction === 'iaai') {
        return iaaiCalcualteTotal({
          bidAmount: Number(dto.bidAmount),
          bidType: dto.bidType,
          bidPay: dto.bidPay,
          bidVehicle: dto.bidVehicle,
          gateFee: 95,
          environmentalFee: 20,
          titleHandelingFee: 15,
        });
      }

      throw new BadRequestException(
        'auction must be either "copart" or "iaai"',
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to calculate quote',
      );
    }
  }

  getTowing(dto: FeeProfileDto) {
      if (!dto.fromState || !dto.fromCity) {
        return null;
      } else {
          return estimateInlandTowing({
          fromState: dto.fromState,
          fromCity: dto.fromCity,
        })
      }
  }

  getFullQuote(dto: FeeProfileDto) {
    return {
      quote: this.getQuote(dto),
      towing: this.getTowing(dto),
    };
  }
}