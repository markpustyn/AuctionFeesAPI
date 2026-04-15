export type BidType = "online" | "kiosk" | "non-kiosk" | string
export type BidPay = "secured" | "unsecured"
export type BidVehicle = "standard" | "heavy" | "crashedToys"


export type FeeRange = { min: number; max: number; fee: number }
export type FeeTable = Record<BidType, { ranges: FeeRange[] }>
