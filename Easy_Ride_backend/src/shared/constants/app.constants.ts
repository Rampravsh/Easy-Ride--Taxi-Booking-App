// =============================================================================
// EASY RIDE — CENTRALIZED APPLICATION CONSTANTS
// All cross-module, environment-independent constants belong here.
// =============================================================================

import { RideStatus } from '../enums';

// ---------------------------------------------------------------------------
// RIDE CONSTANTS
// ---------------------------------------------------------------------------

export const RIDE_CONFIG = {
  MAX_SEARCH_RADIUS_KM: 5,
  DRIVER_SEARCH_TIMEOUT_MS: 30_000, // 30 seconds
  DEFAULT_SURGE_MULTIPLIER: 1.0,
  MAX_SURGE_MULTIPLIER: 3.0,
  OTP_LENGTH: 4,
  MAX_RIDER_MATCH_LIMIT: 10,
} as const;

/**
 * Authoritative ride state machine.
 * All modules must use this — do NOT define transitions locally.
 */
export const ALLOWED_RIDE_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  [RideStatus.SEARCHING]: [RideStatus.ACCEPTED, RideStatus.CANCELLED],
  [RideStatus.ACCEPTED]: [RideStatus.ARRIVING, RideStatus.CANCELLED],
  [RideStatus.ARRIVING]: [RideStatus.STARTED, RideStatus.CANCELLED],
  [RideStatus.STARTED]: [RideStatus.COMPLETED],
  [RideStatus.COMPLETED]: [],
  [RideStatus.CANCELLED]: [],
};

// ---------------------------------------------------------------------------
// PRICING CONSTANTS (canonical — pricing.constants.ts references these)
// ---------------------------------------------------------------------------

export const BASE_FARE_BY_VEHICLE = {
  bike: 30,
  auto: 40,
  car: 50,
  luxury: 100,
} as const;

export const PER_KM_RATE_BY_VEHICLE = {
  bike: 8,
  auto: 10,
  car: 15,
  luxury: 25,
} as const;

export const PER_MINUTE_RATE_BY_VEHICLE = {
  bike: 1,
  auto: 1.5,
  car: 2,
  luxury: 3,
} as const;

export const POOL_DISCOUNT_RATE = 0.25; // 25% discount for pool rides
export const TAX_PERCENTAGE = 5;

// ---------------------------------------------------------------------------
// WALLET CONSTANTS
// ---------------------------------------------------------------------------

export const WALLET_CONFIG = {
  MIN_TOPUP: 10,
  MAX_TOPUP: 10_000,
  MAX_BALANCE: 50_000,
} as const;

export const WALLET_ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance for this transaction',
  WALLET_BLOCKED: 'Your wallet is blocked. Please contact support.',
  NOT_FOUND: 'Wallet not found',
  MAX_BALANCE_EXCEEDED: `Wallet balance cannot exceed ${50_000}`,
} as const;

// ---------------------------------------------------------------------------
// SCHEDULE CONSTANTS
// ---------------------------------------------------------------------------

export const SCHEDULE_CONFIG = {
  MIN_ADVANCE_MINUTES: 30,       // Minimum booking advance time
  ACTIVATION_BEFORE_MINUTES: 10, // Start matching 10 min before scheduled time
  REMINDER_BEFORE_MINUTES: 30,   // Send reminder 30 min before
  CANCELLATION_BEFORE_HOURS: 1,  // Free cancellation window
} as const;

// ---------------------------------------------------------------------------
// POOL CONSTANTS
// ---------------------------------------------------------------------------

export const POOL_CONFIG = {
  DEFAULT_MAX_SEATS: 4,
  MIN_SEATS_PER_BOOKING: 1,
  MAX_SEATS_PER_BOOKING: 3,
} as const;

// ---------------------------------------------------------------------------
// PAYMENT CONSTANTS
// ---------------------------------------------------------------------------

export const PAYMENT_CONFIG = {
  DEFAULT_CURRENCY: 'INR',
  SUPPORTED_CURRENCIES: ['INR'],
} as const;

// ---------------------------------------------------------------------------
// FRAUD DETECTION THRESHOLDS
// ---------------------------------------------------------------------------

export const FRAUD_CONFIG = {
  MAX_SPEED_KMH: 150,            // Above this is a GPS spoof flag
  MIN_RIDE_DURATION_SECONDS: 120, // Below this is a fake ride flag
} as const;

// ---------------------------------------------------------------------------
// PAGINATION DEFAULTS
// ---------------------------------------------------------------------------

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
