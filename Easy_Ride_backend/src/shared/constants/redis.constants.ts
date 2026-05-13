export const REDIS_KEYS = {
  // Rider Keys
  ACTIVE_RIDERS: 'active:riders', // GEO set for available riders
  RIDER_LOCATION: (riderId: string) => `rider:location:${riderId}`,
  RIDER_SESSION: (riderId: string) => `rider:session:${riderId}`,
  ONLINE_RIDERS: 'online:riders',

  // Ride Keys
  ACTIVE_RIDE: (rideId: string) => `active:ride:${rideId}`,
  RIDE_TRACKING: (rideId: string) => `tracking:ride:${rideId}`,
  RIDE_OTP: (rideId: string) => `otp:ride:${rideId}`,
  
  // Socket Mapping Keys
  SOCKET_USER: (userId: string) => `socket:user:${userId}`,
  SOCKET_RIDER: (riderId: string) => `socket:rider:${riderId}`,
  
  // Pub/Sub Channels
  CHANNEL_RIDE_UPDATES: 'channel:ride_updates',
  CHANNEL_LOCATION_UPDATES: 'channel:location_updates',
  CHANNEL_NOTIFICATIONS: 'channel:notifications',
};

export const REDIS_TTL = {
  RIDER_LOCATION: 60 * 5, // 5 minutes
  ACTIVE_RIDE: 60 * 60 * 2, // 2 hours
  RIDE_OTP: 60 * 10, // 10 minutes
  SOCKET_SESSION: 60 * 60 * 24, // 24 hours
};
