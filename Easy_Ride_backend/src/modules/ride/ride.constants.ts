export const RIDE_CONSTANTS = {
  BASE_FARE: 50, // Base price in currency
  PER_KM_CHARGE: 15,
  PER_MINUTE_CHARGE: 2,
  SURGE_MULTIPLIER_DEFAULT: 1.0,
  TAX_PERCENTAGE: 5,
  SEARCH_RADIUS_KM: 5,
  MAX_RIDER_MATCH_LIMIT: 10,
  OTP_LENGTH: 4,
};

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  searching: ['accepted', 'cancelled'],
  accepted: ['arriving', 'cancelled'],
  arriving: ['started', 'cancelled'],
  started: ['completed'],
  completed: [],
  cancelled: [],
};
