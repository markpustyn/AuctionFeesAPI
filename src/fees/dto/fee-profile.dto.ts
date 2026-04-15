import { IsNumber, IsString, IsEnum} from 'class-validator';


export enum BidType {
  ONLINE = 'online',
  KIOSK = 'kiosk',
  NON_KIOSK = 'non-kiosk',
}
export enum Auction {
  IAAI = 'iaai',
  COPART = 'copart',
}

export enum BidPay {
  STANDARD = 'standard',
  HIGH = 'high',
  SECURED = 'secured',
  UNSECURED = 'unsecured',
}

export enum BidVehicle {
  STANDARD = 'standard',
  HEAVY = 'heavy',
  CRASHED = 'crashedToys',
  LICENSED = 'licensed',
  NON_LICENSED = 'non-licensed',
  REC_RIDES = 'recRides',
}


export class FeeProfileDto {
  @IsNumber()
  bidAmount: number;

  @IsEnum(Auction)
  auction: Auction;

  @IsEnum(BidVehicle)
  bidVehicle: BidVehicle;

  @IsEnum(BidType)
  bidType: BidType;

  @IsEnum(BidPay)
  bidPay: BidPay;

  @IsString()
  fromCity: string;

  @IsString()
  fromState: string;
}