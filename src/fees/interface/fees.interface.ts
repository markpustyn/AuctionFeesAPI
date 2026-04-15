export type BidType = "online" | "kiosk" | "non-kiosk"
export type BidPay = "secured" | "unsecured" | "standard" | "high"
export type BidVehicle = "standard" | "heavy" | "crashedToys"| "licensed" | "non-licensed" | "recRides" 


export type FeeRange = { min: number; max: number; fee: number }
export type FeeTable = Record<BidType, { ranges: FeeRange[] }>
