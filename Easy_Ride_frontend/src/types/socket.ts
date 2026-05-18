import { GeoCoordinates } from './user';

export type SocketConnectionState = 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface RiderLocationUpdate {
  riderId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  rideId?: string;
}

export interface RideLocationSyncEvent {
  rideId: string;
  status?: string;
  coordinates: GeoCoordinates; // [longitude, latitude]
  heading?: number;
  eta?: number;
}

export interface RideAcceptedEvent {
  rideId: string;
  rider: {
    name: string;
    phoneNumber: string;
    rating: number;
    avatar?: string;
  };
  vehicle: {
    model: string;
    plateNumber: string;
  };
}

export interface RideCancelledEvent {
  rideId: string;
  reason: string;
}

// Map the exact socket event names from the backend socket architecture
export const SocketEvents = {
  // System Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT_ATTEMPT: 'reconnect_attempt',

  // Presence/Tracking
  RIDER_LOCATION_UPDATE: 'rider:location_update',

  // Ride Lifecycle Events
  RIDE_ACCEPTED: 'ride:accepted',
  RIDE_ARRIVED: 'ride:arrived',
  RIDE_STARTED: 'ride:started',
  RIDE_COMPLETED: 'ride:completed',
  RIDE_CANCELLED: 'ride:cancelled',
  RIDE_LOCATION_SYNC: 'ride:location_sync',

  // Client Room Join/Leave
  RIDE_JOIN: 'ride:join',
  RIDE_LEAVE: 'ride:leave',
} as const;
