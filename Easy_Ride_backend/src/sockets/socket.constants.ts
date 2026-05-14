export enum SocketEvents {
  // Connection Events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  // Rider Events
  RIDER_LOCATION_UPDATE = 'rider:location_update',
  RIDER_ONLINE = 'rider:online',
  RIDER_OFFLINE = 'rider:offline',

  // Ride Events
  RIDE_REQUESTED = 'ride:requested',
  RIDE_ACCEPTED = 'ride:accepted',
  RIDE_ARRIVED = 'ride:arrived',
  RIDE_STARTED = 'ride:started',
  RIDE_COMPLETED = 'ride:completed',
  RIDE_CANCELLED = 'ride:cancelled',
  RIDE_LOCATION_SYNC = 'ride:location_sync',

  // Notification Events
  NOTIFICATION_RECEIVED = 'notification:received',
}

export const SOCKET_ROOMS = {
  USER: (userId: string) => `user:${userId}`,
  RIDER: (riderId: string) => `rider:${riderId}`,
  RIDE: (rideId: string) => `ride:${rideId}`,
};

export const SOCKET_CONSTANTS = {
  LOCATION_UPDATE_INTERVAL: 3000, // 3 seconds
  SESSION_TTL: 60 * 60 * 24, // 24 hours
};
