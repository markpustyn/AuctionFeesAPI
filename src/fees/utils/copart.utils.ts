import { CalculateTotalArgs, crashedToysSec, crashedToysUns, feeTable, securedPaymentFees, unsecuredPaymentFees } from "../data/copart.range"
import { FeeRange } from "../interface/fees.interface"

function findRange(ranges: FeeRange[], bid: number) {
  return ranges.find((r) => bid >= r.min && bid <= r.max) ?? null
}

export function copartCalculateTotal(args: CalculateTotalArgs) {
  const bidAmount =
    typeof args.bidAmount === "number" ? args.bidAmount : parseFloat(args.bidAmount)

  const gateFee = args.gateFee ?? 0
  const environmentalFee = args.environmentalFee ?? 0
  const titleHandelingFee = args.titleHandelingFee ?? 0

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

  if (!Number.isFinite(bidAmount)) return empty

  const feeRanges = feeTable[args.bidType].ranges

  let paymentFeeRanges: FeeRange[] = []

  if (args.bidPay === "unsecured" && (args.bidVehicle === "standard" || args.bidVehicle === "heavy")) {
    paymentFeeRanges = unsecuredPaymentFees.unsecured.ranges
  } else if (args.bidPay === "secured" && (args.bidVehicle === "standard" || args.bidVehicle === "heavy")) {
    paymentFeeRanges = securedPaymentFees.ranges
  } else if (args.bidPay === "secured" && args.bidVehicle === "crashedToys") {
    paymentFeeRanges = crashedToysSec.ranges
  } else if (args.bidPay === "unsecured" && args.bidVehicle === "crashedToys") {
    paymentFeeRanges = crashedToysUns.ranges
  } else {
    return empty
  }

  const selectedFeeRange = findRange(feeRanges, bidAmount)
  const selectedPaymentRange = findRange(paymentFeeRanges, bidAmount)

  const biddingFee = selectedFeeRange?.fee ?? 0
  let paymentFee = selectedPaymentRange?.fee ?? 0

  if (!selectedPaymentRange) {
    if (args.bidVehicle === "crashedToys") {
      if (args.bidPay === "secured") {
        paymentFee = Math.floor(0.155 * bidAmount)
      } else if (args.bidPay === "unsecured") {
        paymentFee = Math.floor(0.205 * bidAmount)
      }
    } else if (args.bidVehicle === "heavy") {
      if (args.bidPay === "secured") {
        paymentFee = Math.floor(0.15 * bidAmount)
      } else if (args.bidPay === "unsecured") {
        paymentFee = Math.floor(0.2 * bidAmount)
      }
    } else {
      if (args.bidPay === "secured") {
        paymentFee = Math.floor(0.075 * bidAmount)
      } else if (args.bidPay === "unsecured") {
        paymentFee = Math.floor(0.125 * bidAmount)
      }
    }
  } else {
    if (bidAmount >= 15000 && (args.bidVehicle === "standard")) {
      if (args.bidPay === "unsecured") paymentFee = Math.floor(0.125 * bidAmount)
      if (args.bidPay === "secured") paymentFee = Math.floor(0.075 * bidAmount)
    }

    if (args.bidVehicle === "heavy" && bidAmount >= 5500) {
      if (args.bidPay === "secured") paymentFee = Math.floor(0.15 * bidAmount)
      if (args.bidPay === "unsecured") paymentFee = Math.floor(0.2 * bidAmount)
    }

    if (args.bidVehicle === "crashedToys" && bidAmount >= 10000) {
      if (args.bidPay === "secured") paymentFee = Math.floor(0.155 * bidAmount)
      if (args.bidPay === "unsecured") paymentFee = Math.floor(0.205 * bidAmount)
    }
  }

  const auctionFee =
    biddingFee + paymentFee + gateFee + environmentalFee + titleHandelingFee

  const totalAmount = bidAmount + auctionFee

  return {
    bidAmount,
    auctionFees: {
      auctionFee,
      totalAmount,
    },
  }
}