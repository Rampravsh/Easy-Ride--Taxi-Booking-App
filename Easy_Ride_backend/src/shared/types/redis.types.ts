export type RedisValue = string | number | boolean | object;

export type RedisKeyPattern = 
  | 'active:riders'
  | 'online:riders'
  | 'channel:ride_updates'
  | 'channel:location_updates'
  | 'channel:notifications';

export type SocketSessionData = {
  socketId: string;
  connectedAt: string;
  role: 'user' | 'rider';
};
