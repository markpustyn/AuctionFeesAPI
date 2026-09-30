import {
  CalculateTotalArgs,
  crashedToysSec,
  crashedToysUns,
  feeTable,
  highVolumeSecuredPaymentFees,
  highVolumeUnsecuredPaymentFees,
  securedPaymentFees,
  unsecuredPaymentFees,
} from '../data/copart.range';
import { FeeRange } from '../interface/fees.interface';

function findRange(ranges: FeeRange[], bid: number) {
  return ranges.find((r) => bid >= r.min && bid <= r.max) ?? null;
}

export function copartCalculateTotal(args: CalculateTotalArgs) {
  const bidAmount =
    typeof args.bidAmount === 'number'
      ? args.bidAmount
      : parseFloat(args.bidAmount);

  const gateFee = args.gateFee ?? 0;
  const environmentalFee = args.environmentalFee ?? 0;
  const titleHandelingFee = args.titleHandelingFee ?? 0;
  const towingTotal = args.towingTotal ?? 0;

  const empty = {
    bidAmount: 0,
    auctionFees: {
      auctionFee: 0,
      totalAmount: 0,
    },
  };

  if (Number.isNaN(bidAmount)) return empty;

  const feeRanges = feeTable[args.bidType].ranges;

  let paymentFeeRanges: FeeRange[] = [];

  const isStandardOrHeavy =
    args.bidVehicle === 'standard' || args.bidVehicle === 'heavy';

  if (
    args.bidPay === 'unsecured' &&
    isStandardOrHeavy &&
    args.volume === 'high'
  ) {
    paymentFeeRanges = highVolumeUnsecuredPaymentFees.ranges;
  } else if (
    args.bidPay === 'secured' &&
    isStandardOrHeavy &&
    args.volume === 'high'
  ) {
    paymentFeeRanges = highVolumeSecuredPaymentFees.ranges;
  } else if (
    args.bidPay === 'unsecured' &&
    isStandardOrHeavy &&
    args.volume === 'low'
  ) {
    paymentFeeRanges = unsecuredPaymentFees.unsecured.ranges;
  } else if (
    args.bidPay === 'secured' &&
    isStandardOrHeavy &&
    args.volume === 'low'
  ) {
    paymentFeeRanges = securedPaymentFees.ranges;
  } else if (args.bidPay === 'secured' && isStandardOrHeavy) {
    paymentFeeRanges = securedPaymentFees.ranges;
  } else if (args.bidPay === 'secured' && args.bidVehicle === 'crashedToys') {
    paymentFeeRanges = crashedToysSec.ranges;
  } else if (args.bidPay === 'unsecured' && args.bidVehicle === 'crashedToys') {
    paymentFeeRanges = crashedToysUns.ranges;
  }

  const selectedFeeRange = findRange(feeRanges, bidAmount);
  const selectedPaymentRange = findRange(paymentFeeRanges, bidAmount);
  if (!selectedFeeRange || !selectedPaymentRange) {
    return empty;
  }

  const biddingFee = selectedFeeRange.fee;
  let paymentFee = selectedPaymentRange.fee;

  if (bidAmount >= 15000) {
    if (args.bidPay === 'unsecured' && args.volume === 'low') {
      paymentFee = Math.floor(0.125 * bidAmount);
    } else if (args.bidPay === 'secured' && args.volume === 'low') {
      paymentFee = Math.floor(0.075 * bidAmount);
    } else if (args.bidPay === 'unsecured' && args.volume === 'high') {
      paymentFee = Math.floor(0.111 * bidAmount);
    } else if (args.bidPay === 'secured' && args.volume === 'high') {
      paymentFee = Math.floor(0.06 * bidAmount);
    }
  }

  if (
    args.bidVehicle === 'heavy' &&
    bidAmount >= 5500 &&
    args.bidPay === 'secured'
  ) {
    paymentFee += Math.floor(0.15 * bidAmount - paymentFee);
  } else if (
    args.bidVehicle === 'heavy' &&
    bidAmount >= 5500 &&
    args.bidPay === 'unsecured'
  ) {
    paymentFee += Math.floor(0.2 * bidAmount - paymentFee);
  }

  if (
    args.bidVehicle === 'crashedToys' &&
    bidAmount >= 10000 &&
    args.bidPay === 'secured'
  ) {
    paymentFee += Math.floor(0.155 * bidAmount - paymentFee);
  } else if (
    args.bidVehicle === 'crashedToys' &&
    bidAmount >= 10000 &&
    args.bidPay === 'unsecured'
  ) {
    paymentFee += Math.floor(0.205 * bidAmount - paymentFee);
  }

  const auctionFee =
    gateFee + biddingFee + environmentalFee + paymentFee + titleHandelingFee;

  const totalAmount =
    bidAmount +
    gateFee +
    biddingFee +
    environmentalFee +
    paymentFee +
    titleHandelingFee +
    towingTotal;

  return {
    bidAmount,
    auctionFees: {
      auctionFee,

      totalAmount,
    },
  };
}
