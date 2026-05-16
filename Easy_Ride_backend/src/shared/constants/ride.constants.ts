/**
 * DEPRECATED SHIM — src/shared/constants/ride.constants.ts
 *
 * All constants have been moved to src/shared/constants/app.constants.ts.
 * This file re-exports from the canonical location for backward compatibility.
 * Migrate all imports to app.constants.ts in your next cleanup pass.
 */
export {
  RIDE_CONFIG as RIDE_CONFIG,
  ALLOWED_RIDE_TRANSITIONS,
} from './app.constants';

/** @deprecated Use RIDE_CONFIG.MAX_SEARCH_RADIUS_KM from app.constants */
export const MAX_RIDE_RADIUS = 5000;

/** @deprecated Use RIDE_CONFIG.DRIVER_SEARCH_TIMEOUT_MS from app.constants */
export const DRIVER_SEARCH_TIMEOUT = 30000;

/** @deprecated Use RIDE_CONFIG.DEFAULT_SURGE_MULTIPLIER from app.constants */
export const DEFAULT_SURGE_MULTIPLIER = 1;
