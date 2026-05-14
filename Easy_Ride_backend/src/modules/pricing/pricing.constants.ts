export interface FareCalculationParams {
  distance: number; // in km
  duration: number; // in minutes
  vehicleType: string;
  isPool?: boolean;
}

export const PRICING_CONSTANTS = {
  BASE_FARES: {
    bike: 20,
    auto: 30,
    car: 50,
    luxury: 100,
  },
  PER_KM_RATES: {
    bike: 5,
    auto: 8,
    car: 12,
    luxury: 25,
  },
  PER_MINUTE_RATES: {
    bike: 1,
    auto: 1.5,
    car: 2,
    luxury: 5,
  },
  POOL_DISCOUNT: 0.3, // 30% discount for pooling
};
