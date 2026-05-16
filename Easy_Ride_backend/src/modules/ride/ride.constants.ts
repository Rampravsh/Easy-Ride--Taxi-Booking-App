import { RideStatus } from '../../shared/enums';
import { ALLOWED_RIDE_TRANSITIONS, RIDE_CONFIG } from '../../shared/constants/app.constants';

// Re-export the canonical transition map from the central constants.
// This is the authoritative source — do not define transitions elsewhere.
export { ALLOWED_RIDE_TRANSITIONS };

/**
 * Pricing defaults for the ride module (per-ride calculation).
 * Full pricing constants are in pricing.constants.ts.
 */
export const RIDE_CONSTANTS = {
  BASE_FARE: 50,
  PER_KM_CHARGE: 15,
  PER_MINUTE_CHARGE: 2,
  SURGE_MULTIPLIER_DEFAULT: RIDE_CONFIG.DEFAULT_SURGE_MULTIPLIER,
  TAX_PERCENTAGE: 5,
  SEARCH_RADIUS_KM: RIDE_CONFIG.MAX_SEARCH_RADIUS_KM,
  MAX_RIDER_MATCH_LIMIT: RIDE_CONFIG.MAX_RIDER_MATCH_LIMIT,
  OTP_LENGTH: RIDE_CONFIG.OTP_LENGTH,
};
