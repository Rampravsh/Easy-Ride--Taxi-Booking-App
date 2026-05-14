import { Socket } from 'socket.io';
import { UserRole } from '../shared/enums';

export interface SocketData {
  userId: string;
  role: UserRole;
  firebaseUID: string;
}

export type AuthenticatedSocket = Socket<any, any, any, SocketData>;

export interface LocationPayload {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}

export interface RideEventPayload {
  rideId: string;
  status: string;
  timestamp: string;
  data?: any;
}
