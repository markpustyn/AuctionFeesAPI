import { BidPay, BidType, BidVehicle, FeeTable } from "../interface/fees.interface"

export type CalculateTotalArgs = {
  bidAmount: number
  bidType: BidType
  bidPay: BidPay
  bidVehicle: BidVehicle
  gateFee: number
  environmentalFee: number
  titleHandelingFee: number
}

export type FeeRange = { min: number; max: number; fee: number }

export const feeTable: FeeTable = {
  online: {
    ranges: [
      { min: 0, max: 99.99, fee: 0 },
      { min: 100, max: 499.99, fee: 50 },
      { min: 500, max: 999.99, fee: 65 },
      { min: 1000, max: 1499.99, fee: 85 },
      { min: 1500, max: 1999.99, fee: 95 },
      { min: 2000, max: 3999.99, fee: 110 },
      { min: 4000, max: 5999.99, fee: 125 },
      { min: 6000, max: 7999.99, fee: 145 },
      { min: 8000, max: Infinity, fee: 160 },
    ],
  },
  kiosk: {
    ranges: [
      { min: 0, max: 99.99, fee: 0 },
      { min: 100, max: 499.99, fee: 40 },
      { min: 500, max: 999.99, fee: 55 },
      { min: 1000, max: 1499.99, fee: 75 },
      { min: 1500, max: 1999.99, fee: 85 },
      { min: 2000, max: 3999.99, fee: 100 },
      { min: 4000, max: 5999.99, fee: 110 },
      { min: 6000, max: 7999.99, fee: 125 },
      { min: 8000, max: Infinity, fee: 140 },
    ],
  },
  "non-kiosk": {
    ranges: []
  }
}


export const standardPaymentFees = {
  ranges: [
    { min: 0.0, max: 99.99, fee: 1.0 },
    { min: 100.0, max: 199.99, fee: 25.0 },
    { min: 200.0, max: 299.99, fee: 60.0 },
    { min: 300.0, max: 349.99, fee: 85.0 },
    { min: 350.0, max: 399.99, fee: 100.0 },
    { min: 400.0, max: 449.99, fee: 125.0 },
    { min: 450.0, max: 499.99, fee: 135.0 },
    { min: 500.0, max: 549.99, fee: 145.0 },
    { min: 550.0, max: 599.99, fee: 155.0 },
    { min: 600.0, max: 699.99, fee: 170.0 },
    { min: 700.0, max: 799.99, fee: 195.0 },
    { min: 800.0, max: 899.99, fee: 215.0 },
    { min: 900.0, max: 999.99, fee: 230.0 },
    { min: 1000.0, max: 1199.99, fee: 250.0 },
    { min: 1200.0, max: 1299.99, fee: 270.0 },
    { min: 1300.0, max: 1399.99, fee: 285.0 },
    { min: 1400.0, max: 1499.99, fee: 300.0 },
    { min: 1500.0, max: 1599.99, fee: 315.0 },
    { min: 1600.0, max: 1699.99, fee: 330.0 },
    { min: 1700.0, max: 1799.99, fee: 350.0 },
    { min: 1800.0, max: 1999.99, fee: 370.0 },
    { min: 2000.0, max: 2399.99, fee: 390.0 },
    { min: 2400.0, max: 2499.99, fee: 425.0 },
    { min: 2500.0, max: 2999.99, fee: 460.0 },
    { min: 3000.0, max: 3499.99, fee: 505.0 },
    { min: 3500.0, max: 3999.99, fee: 555.0 },
    { min: 4000.0, max: 4499.99, fee: 600.0 },
    { min: 4500.0, max: 4999.99, fee: 625.0 },
    { min: 5000.0, max: 5499.99, fee: 650.0 },
    { min: 5500.0, max: 5999.99, fee: 675.0 },
    { min: 6000.0, max: 6499.99, fee: 700.0 },
    { min: 6500.0, max: 6999.99, fee: 720.0 },
    { min: 7000.0, max: 7499.99, fee: 755.0 },
    { min: 7500.0, max: 7999.99, fee: 775.0 },
    { min: 8000.0, max: 8499.99, fee: 800.0 },
    { min: 8500.0, max: 9999.99, fee: 820.0 },
    { min: 10000.0, max: 11499.99, fee: 850.0 },
    { min: 11500.0, max: 11999.99, fee: 860.0 },
    { min: 12000.0, max: 12499.99, fee: 875.0 },
    { min: 12500.0, max: 14999.99, fee: 890.0 },
    { min: 15000.0, max: Infinity, fee: 1000.0 },
  ],
}

export const highPaymentFees = {
  ranges: [
    { min: 0.0, max: 49.99, fee: 25.0 },
    { min: 50.0, max: 99.99, fee: 45.0 },
    { min: 100.0, max: 199.99, fee: 80.0 },
    { min: 200.0, max: 299.99, fee: 130.0 },
    { min: 300.0, max: 349.99, fee: 137.5 },
    { min: 350.0, max: 399.99, fee: 145.0 },
    { min: 400.0, max: 449.99, fee: 175.0 },
    { min: 450.0, max: 499.99, fee: 185.0 },
    { min: 500.0, max: 549.99, fee: 205.0 },
    { min: 550.0, max: 599.99, fee: 210.0 },
    { min: 600.0, max: 699.99, fee: 240.0 },
    { min: 700.0, max: 799.99, fee: 270.0 },
    { min: 800.0, max: 899.99, fee: 295.0 },
    { min: 900.0, max: 999.99, fee: 320.0 },
    { min: 1000.0, max: 1199.99, fee: 375.0 },
    { min: 1200.0, max: 1299.99, fee: 395.0 },
    { min: 1300.0, max: 1399.99, fee: 410.0 },
    { min: 1400.0, max: 1499.99, fee: 430.0 },
    { min: 1500.0, max: 1599.99, fee: 445.0 },
    { min: 1600.0, max: 1699.99, fee: 465.0 },
    { min: 1700.0, max: 1799.99, fee: 485.0 },
    { min: 1800.0, max: 1999.99, fee: 510.0 },
    { min: 2000.0, max: 2399.99, fee: 535.0 },
    { min: 2400.0, max: 2499.99, fee: 570.0 },
    { min: 2500.0, max: 2999.99, fee: 610.0 },
    { min: 3000.0, max: 3499.99, fee: 655.0 },
    { min: 3500.0, max: 3999.99, fee: 705.0 },
    { min: 4000.0, max: 4499.99, fee: 725.0 },
    { min: 4500.0, max: 4999.99, fee: 750.0 },
    { min: 5000.0, max: 5499.99, fee: 775.0 },
    { min: 5500.0, max: 5999.99, fee: 800.0 },
    { min: 6000.0, max: 6499.99, fee: 825.0 },
    { min: 6500.0, max: 6999.99, fee: 845.0 },
    { min: 7000.0, max: 7499.99, fee: 880.0 },
    { min: 7500.0, max: 7999.99, fee: 900.0 },
    { min: 8000.0, max: 8499.99, fee: 925.0 },
    { min: 8500.0, max: 9999.99, fee: 945.0 },
    { min: 10000.0, max: 14999.99, fee: 1000.0 },
    { min: 15000.0, max: Infinity, fee: 1000.0 },
  ],
}

export const recRides = {
  ranges: [
    { min: 0, max: 49.99, fee: 30.0 },
    { min: 50.0, max: 99.99, fee: 45.0 },
    { min: 100.0, max: 199.99, fee: 70.0 },
    { min: 200.0, max: 299.99, fee: 100.0 },
    { min: 300.0, max: 399.99, fee: 120.0 },
    { min: 400.0, max: 499.99, fee: 150.0 },
    { min: 500.0, max: 599.99, fee: 170.0 },
    { min: 600.0, max: 699.99, fee: 195.0 },
    { min: 700.0, max: 799.99, fee: 225.0 },
    { min: 800.0, max: 899.99, fee: 245.0 },
    { min: 900.0, max: 999.99, fee: 265.0 },
    { min: 1000.0, max: 1199.99, fee: 290.0 },
    { min: 1200.0, max: 1399.99, fee: 325.0 },
    { min: 1400.0, max: 1599.99, fee: 350.0 },
    { min: 1600.0, max: 1799.99, fee: 375.0 },
    { min: 1800.0, max: 1999.99, fee: 425.0 },
    { min: 2000.0, max: 2199.99, fee: 450.0 },
    { min: 2200.0, max: 2499.99, fee: 475.0 },
    { min: 2500.0, max: 2999.99, fee: 500.0 },
    { min: 3000.0, max: 3499.99, fee: 575.0 },
    { min: 3500.0, max: 3999.99, fee: 600.0 },
    { min: 4000.0, max: 4999.99, fee: 650.0 },
    { min: 5000.0, max: 5999.99, fee: 700.0 },
    { min: 6000.0, max: 6999.99, fee: 750.0 },
    { min: 7000.0, max: 7999.99, fee: 825.0 },
    { min: 8000.0, max: 8999.99, fee: 900.0 },
    { min: 9000.0, max: 9999.99, fee: 975.0 },
    { min: 10000.0, max: Infinity, fee: 990.0 },
  ],
}
