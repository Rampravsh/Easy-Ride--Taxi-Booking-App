export interface IRedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface ILocationData {
  latitude: number;
  longitude: number;
  riderId: string;
  timestamp: string;
}

export interface IRideTrackingData {
  rideId: string;
  latitude: number;
  longitude: number;
  status: string;
}
