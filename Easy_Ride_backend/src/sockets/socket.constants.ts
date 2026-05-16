// =============================================================================
// EASY RIDE — SOCKET.IO EVENT CONSTANTS & ROOM HELPERS
// Single source of truth for all socket event names and room naming conventions.
// =============================================================================

// ---------------------------------------------------------------------------
// EVENT NAMES
// ---------------------------------------------------------------------------

export enum SocketEvents {
  // System Events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  // Rider Presence Events
  RIDER_LOCATION_UPDATE = 'rider:location_update',
  RIDER_ONLINE = 'rider:online',
  RIDER_OFFLINE = 'rider:offline',

  // Ride Lifecycle Events
  RIDE_REQUESTED = 'ride:requested',
  RIDE_ACCEPTED = 'ride:accepted',
  RIDE_ARRIVED = 'ride:arrived',
  RIDE_STARTED = 'ride:started',
  RIDE_COMPLETED = 'ride:completed',
  RIDE_CANCELLED = 'ride:cancelled',
  RIDE_LOCATION_SYNC = 'ride:location_sync',
  RIDE_STATUS_UPDATE = 'ride:status_update',
  RIDE_OTP_VERIFIED = 'ride:otp_verified',

  // Matching Events
  RIDER_FOUND = 'ride:rider_found',
  NO_RIDER_FOUND = 'ride:no_rider_found',

  // Notification Events
  NOTIFICATION_RECEIVED = 'notification:received',
  NOTIFICATION_READ = 'notification:read',

  // Chat Events
  CHAT_SEND = 'chat:send',
  CHAT_RECEIVE = 'chat:receive',
  CHAT_TYPING = 'chat:typing',
  CHAT_DELIVERED = 'chat:delivered',
  CHAT_READ = 'chat:read',

  // Call Events
  CALL_INITIATE = 'call:initiate',
  CALL_INCOMING = 'call:incoming',
  CALL_RINGING = 'call:ringing',
  CALL_ACCEPTED = 'call:accepted',
  CALL_REJECTED = 'call:rejected',
  CALL_ENDED = 'call:ended',
  CALL_MISSED = 'call:missed',
  CALL_FAILED = 'call:failed',

  // Pool Events
  POOL_JOINED = 'pool:joined',
  POOL_LEFT = 'pool:left',
  POOL_STATUS_UPDATE = 'pool:status_update',
  POOL_FULL = 'pool:full',
  POOL_STARTED = 'pool:started',
  POOL_COMPLETED = 'pool:completed',

  // Schedule Events
  SCHEDULE_CREATED = 'schedule:created',
  SCHEDULE_CANCELLED = 'schedule:cancelled',
  SCHEDULE_REMINDER = 'schedule:reminder',
  SCHEDULE_ACTIVATING = 'schedule:activating',

  // Payment Events
  PAYMENT_PENDING = 'payment:pending',
  PAYMENT_SUCCESS = 'payment:success',
  PAYMENT_FAILED = 'payment:failed',
  PAYMENT_REFUNDED = 'payment:refunded',

  // Admin Events
  ADMIN_BROADCAST = 'admin:broadcast',
  ADMIN_RIDER_UPDATE = 'admin:rider_update',
  ADMIN_ALERT = 'admin:alert',

  // Fraud Events
  FRAUD_DETECTED = 'fraud:detected',
}

// ---------------------------------------------------------------------------
// ROOM NAMING CONVENTIONS
// All socket rooms must use these helpers — never hardcode room names.
// ---------------------------------------------------------------------------

export const SOCKET_ROOMS = {
  USER: (userId: string) => `user:${userId}`,
  RIDER: (riderId: string) => `rider:${riderId}`,
  RIDE: (rideId: string) => `ride:${rideId}`,
  POOL: (poolId: string) => `pool:${poolId}`,
  SCHEDULE: (scheduleId: string) => `schedule:${scheduleId}`,
  ADMIN: () => `admin:room`,
  ADMIN_SCOPED: (adminRole: string) => `admin:${adminRole}`,
} as const;

// ---------------------------------------------------------------------------
// MISC CONFIGURATION
// ---------------------------------------------------------------------------

export const SOCKET_CONSTANTS = {
  LOCATION_UPDATE_INTERVAL_MS: 3_000, // 3 seconds
  SESSION_TTL_SECONDS: 60 * 60 * 24,  // 24 hours
  MAX_RECONNECT_ATTEMPTS: 5,
  PING_INTERVAL_MS: 25_000,
  PING_TIMEOUT_MS: 20_000,
} as const;
