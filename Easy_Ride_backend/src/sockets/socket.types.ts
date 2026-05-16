import { Socket } from 'socket.io';
import { UserRole, AdminRole, RideStatus } from '../shared/enums';

// ---------------------------------------------------------------------------
// Socket Session Data
// ---------------------------------------------------------------------------

export interface SocketData {
  userId: string;
  role: UserRole;
  firebaseUID: string;
  /** Present only when role === UserRole.ADMIN */
  adminRole?: AdminRole;
}

export type AuthenticatedSocket = Socket<any, any, any, SocketData>;

// ---------------------------------------------------------------------------
// Location Payloads
// ---------------------------------------------------------------------------

export interface LocationPayload {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  rideId?: string; // optional: attach to a specific active ride
}

// ---------------------------------------------------------------------------
// Ride Event Payloads
// Typed status uses RideStatus enum — not raw string.
// ---------------------------------------------------------------------------

export interface RideEventPayload {
  rideId: string;
  status: RideStatus;
  timestamp: string;
  data?: Record<string, any>;
}

export interface RideRequestPayload {
  rideId: string;
  userId: string;
  pickupAddress: string;
  dropAddress: string;
  pickupCoordinates: [number, number];
  totalFare: number;
  rideType: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Chat Payloads
// ---------------------------------------------------------------------------

export interface ChatMessagePayload {
  rideId: string;
  messageId: string;
  senderId: string;
  content: string;
  messageType: string;
  timestamp: string;
}

export interface TypingPayload {
  rideId: string;
  senderId: string;
  isTyping: boolean;
}

// ---------------------------------------------------------------------------
// Call Payloads
// ---------------------------------------------------------------------------

export interface CallPayload {
  callId: string;
  rideId: string;
  callerId: string;
  receiverId: string;
  callType: string;
  twilioRoomId?: string;
}

// ---------------------------------------------------------------------------
// Pool Payloads
// ---------------------------------------------------------------------------

export interface PoolJoinPayload {
  poolId: string;
  userId: string;
  seats: number;
  pickupAddress: string;
}

export interface PoolStatusPayload {
  poolId: string;
  status: string;
  availableSeats: number;
}

// ---------------------------------------------------------------------------
// Notification Payloads
// ---------------------------------------------------------------------------

export interface NotificationSocketPayload {
  notificationId: string;
  title: string;
  body: string;
  notificationType: string;
  data?: Record<string, any>;
  timestamp: string;
}
