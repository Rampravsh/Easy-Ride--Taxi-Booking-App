/**
 * Swagger Tags Configuration
 * Grouping endpoints into logical sections.
 */
export const SWAGGER_TAGS = {
  AUTH: 'Authentication',
  USER: 'Users',
  RIDER: 'Riders',
  VEHICLE: 'Vehicles',
  RIDE: 'Rides',
  WALLET: 'Wallets',
  PAYMENT: 'Payments',
  NOTIFICATION: 'Notifications',
  CHAT: 'Chat',
  CALL: 'Calls',
  PROMO: 'Promos',
  SCHEDULE: 'Schedules',
  POOL: 'Pooling',
  ADMIN: 'Admin',
  ANALYTICS: 'Analytics',
  SOCKET: 'Socket Events',
} as const;
