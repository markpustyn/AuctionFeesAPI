import { CalculateTotalArgs, feeTable } from "../data/copart.range"
import { highPaymentFees, recRides, standardPaymentFees } from "../data/iaai.range"
import { FeeRange } from "../interface/fees.interface"

function findRange(ranges: FeeRange[], bid: number) {
  return ranges.find((r) => bid >= r.min && bid <= r.max) ?? null
}

export function iaaiCalcualteTotal(args: CalculateTotalArgs) {
  const bid = args.bidAmount

  const gateFee = args.gateFee ?? 95
  const environmentalFee = args.environmentalFee ?? 15
  const titleHandelingFee = args.titleHandelingFee ?? 20

  const empty = {
    bidAmount: 0,
    auctionFees: {
      biddingFee: 0,
      paymentFee: 0,
      gateFee,
      environmentalFee,
      titleHandelingFee,
      auctionFee: 0,
      totalAmount: 0,
    },
  }

  if (!Number.isFinite(bid) || bid <= 0) {
    return empty
  }

  const feeRanges = feeTable[args.bidType].ranges

  let paymentFeeRanges: FeeRange[] = []

  if (args.bidPay === "high") {
    paymentFeeRanges = highPaymentFees.ranges
  } else if (args.bidVehicle === "licensed") {
    paymentFeeRanges = standardPaymentFees.ranges
  } else if (args.bidVehicle === "non-licensed") {
    paymentFeeRanges = standardPaymentFees.ranges
  } else if (args.bidVehicle === "recRides") {
    paymentFeeRanges = recRides.ranges
  } else if (args.bidVehicle === "heavy") {
    paymentFeeRanges = highPaymentFees.ranges
  }

  if (args.bidPay === "standard") {
    paymentFeeRanges = highPaymentFees.ranges
  } else if (args.bidVehicle === "licensed") {
    paymentFeeRanges = standardPaymentFees.ranges
  } else if (args.bidVehicle === "non-licensed") {
    paymentFeeRanges = standardPaymentFees.ranges
  } else if (args.bidVehicle === "recRides") {
    paymentFeeRanges = recRides.ranges
  } else if (args.bidVehicle === "heavy") {
    paymentFeeRanges = standardPaymentFees.ranges
  }

  const selectedFeeRange = findRange(feeRanges, bid)
  const selectedPaymentRange = findRange(paymentFeeRanges, bid)

  if (!selectedFeeRange) {
    return empty
  }

  const biddingFee = selectedFeeRange.fee
  let paymentFee = selectedPaymentRange?.fee ?? 0

  if (!selectedPaymentRange) {
    if (args.bidVehicle === "recRides") {
      paymentFee = Math.floor(0.105 * bid)
    } else if (args.bidVehicle === "heavy") {
      if (args.bidPay === "standard") {
        paymentFee = Math.floor(0.15 * bid)
      } else {
        paymentFee = Math.floor(0.1 * bid)
      }
    } else {
      if (args.bidPay === "high") {
        paymentFee = Math.floor(0.06 * bid)
      } else {
        paymentFee = Math.floor(0.075 * bid)
      }
    }
  } else {
    if (bid >= 15000) {
      if (args.bidPay === "high") paymentFee = Math.floor(0.06 * bid)
      if (args.bidPay === "standard") paymentFee = Math.floor(0.075 * bid)
    }

    if (args.bidVehicle === "heavy" && bid >= 5500 && args.bidPay === "standard") {
      paymentFee = Math.floor(0.15 * bid)
    } else if (args.bidVehicle === "heavy" && bid >= 8000 && args.bidPay === "high") {
      paymentFee = Math.floor(0.1 * bid)
    }

    if (args.bidVehicle === "recRides" && bid >= 10000) {
      paymentFee = Math.floor(0.105 * bid)
    }
  }

  const auctionFee =
    gateFee +
    biddingFee +
    environmentalFee +
    paymentFee +
    titleHandelingFee

  const totalAmount = bid + auctionFee

  return {
    bidAmount: bid,
    auctionFees: {
      auctionFee,
      totalAmount,
    },
  }
}