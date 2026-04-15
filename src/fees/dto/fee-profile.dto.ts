import { IsNumber, IsString, IsEnum} from 'class-validator';


export enum BidType {
  ONLINE = 'online',
  KIOSK = 'kiosk',
  NON_KIOSK = 'non-kiosk',
}

export enum BidPay {
  SECURED = 'secured',
  UNSECURED = 'unsecured',
}

export enum BidVehicle {
  STANDARD = 'standard',
  HEAVY = 'heavy',
  CRASHED = 'crashedToys',
}


export class FeeProfileDto {
  @IsNumber()
  bidAmount: number;

  @IsString()
  auction: string;

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