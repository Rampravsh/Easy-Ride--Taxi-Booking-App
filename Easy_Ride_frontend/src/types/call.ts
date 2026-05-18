// =============================================================================
// EASY RIDE — CALL TYPE DEFINITIONS
// Aligned strictly with the backend call schema and Twilio credentials.
// =============================================================================

export type CallType = 'audio' | 'video';

export type CallStatus =
  | 'idle'
  | 'initiated'
  | 'ringing'
  | 'accepted'
  | 'rejected'
  | 'missed'
  | 'ended'
  | 'failed';

/**
 * Call Record Schema strictly aligned with Mongoose backend CallSchema.
 */
export interface CallRecord {
  _id: string;
  ride: string; // Ride ID
  caller: string; // Caller User ID
  receiver: string; // Receiver User ID
  callType: CallType;
  status: CallStatus;
  startedAt?: string;
  endedAt?: string;
  duration?: number; // in seconds
  twilioRoomId?: string;
  twilioSid?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Socket.IO Call Incoming Payload structure emitted from the backend.
 */
export interface IncomingCallPayload {
  callId: string;
  callerId: string;
  callType: CallType;
  rideId: string;
  twilioRoomId: string;
}

/**
 * Local Redux slice state definition for active call session tracking.
 */
export interface CallState {
  activeCall: CallRecord | null;
  incomingCall: IncomingCallPayload | null;
  twilioToken: string | null;
  status: CallStatus;
  isMuted: boolean;
  isSpeakerOn: boolean;
  loading: boolean;
  error: string | null;
}
