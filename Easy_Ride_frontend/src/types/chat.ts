// =============================================================================
// EASY RIDE — CHAT TYPE DEFINITIONS
// Aligned strictly with the backend schema and Socket.IO payloads.
// =============================================================================

export type MessageType = 'text' | 'image' | 'audio' | 'location' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

/**
 * Enterprise Chat Message Schema matching strictly the backend MongoDB IMessage document.
 */
export interface ChatMessage {
  _id: string;
  ride: string; // Refers to Ride ID
  sender: string; // Refers to User/Rider ID
  receiver: string; // Refers to User/Rider ID
  messageType: MessageType;
  content: string;
  status: MessageStatus;
  metadata?: Record<string, any>;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * typing event payload matching the backend socket.io broadcast.
 */
export interface TypingEvent {
  rideId: string;
  userId: string;
  isTyping: boolean;
}

/**
 * Legacy UI Message format (kept for absolute UI compatibility)
 */
export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  type?: 'text' | 'image' | 'location' | 'audio' | 'system';
  status?: MessageStatus;
}

/**
 * Legacy UI Chat Session format
 */
export interface ChatSession {
  id: string;
  participantName: string;
  participantAvatar?: any;
  messages: Message[];
}
