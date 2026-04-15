export type Zone = 'YELLOW' | 'LIGHT_BLUE' | 'PURPLE' | 'BLUE' | 'GREEN';

export interface Port {
  city: string;
  state: string;
}

export interface InlandTowingInput {
  fromState: string;
  fromCity: string;
}

export type Location = {
  city: string
  state: string
  lat: number
  lng: number
  price?: number
}