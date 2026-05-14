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
