import socketService from './socket.service';
import { store } from '../redux/store';
import {
  addChatMessage,
  setUserTyping,
  clearTypingIndicators,
  incrementRideUnreadCount,
  updateChatMessageStatus,
} from '../redux/slices/chatSlice';
import { chatApi } from '../api/chat.api';
import { ChatMessage, TypingEvent } from '../types/chat';

// Reuse backend socket event constants
const CHAT_EVENTS = {
  CHAT_SEND: 'chat:send',
  CHAT_RECEIVE: 'chat:receive',
  CHAT_TYPING: 'chat:typing',
  CHAT_READ: 'chat:read',
} as const;

class RealtimeChatService {
  private activeRideId: string | null = null;
  private typingTimeout: any = null;

  /**
   * Initialize chat-specific socket event listeners.
   */
  public initialize() {
    console.log('📡 [RealtimeChatService] Initializing socket handlers');

    // 1. Listen for new messages
    socketService.on(CHAT_EVENTS.CHAT_RECEIVE, (message: ChatMessage) => {
      console.log('📡 [RealtimeChatService] Received new message:', message._id);
      
      // Add message to Redux store
      store.dispatch(addChatMessage(message));

      // If user is NOT currently inside this specific ride chat screen, increment unread badge
      if (this.activeRideId !== message.ride) {
        store.dispatch(incrementRideUnreadCount(message.ride));
      } else {
        // If they are on the screen, immediately mark it as read on the backend
        this.markAsRead(message.ride);
      }
    });

    // 2. Listen for typing indicators
    socketService.on(CHAT_EVENTS.CHAT_TYPING, (event: { rideId: string; userId: string; isTyping: boolean }) => {
      console.log(`📡 [RealtimeChatService] Typing event: User ${event.userId} isTyping=${event.isTyping}`);
      store.dispatch(setUserTyping(event));
    });

    // 3. Listen for read receipts
    socketService.on(CHAT_EVENTS.CHAT_READ, (event: { rideId: string; readerId: string }) => {
      console.log('📡 [RealtimeChatService] Received read receipt for ride:', event.rideId);
      // Update all messages in this ride to 'read' state locally
      const state = store.getState();
      const messages = state.chat.activeChats[event.rideId] || [];
      messages.forEach((msg) => {
        if (msg.sender !== event.readerId && msg.status !== 'read') {
          store.dispatch(
            updateChatMessageStatus({
              rideId: event.rideId,
              messageId: msg._id,
              status: 'read',
            })
          );
        }
      });
    });
  }

  /**
   * Activates context for a specific ride's chat screen (e.g. joins room, tracks active ID).
   */
  public enterChat(rideId: string) {
    this.activeRideId = rideId;
    console.log(`💬 [RealtimeChatService] Entered chat screen for ride: ${rideId}`);
    
    // Automatically mark all messages as read upon entering the screen
    this.markAsRead(rideId);
  }

  /**
   * Deactivates context for the chat screen.
   */
  public leaveChat(rideId: string) {
    this.activeRideId = null;
    console.log(`💬 [RealtimeChatService] Left chat screen for ride: ${rideId}`);
    
    // Clean up typing states
    store.dispatch(clearTypingIndicators(rideId));
    this.sendTypingIndicator(rideId, false);
  }

  /**
   * Emit typing indicator status to the server.
   */
  public sendTypingIndicator(rideId: string, isTyping: boolean) {
    socketService.emit(CHAT_EVENTS.CHAT_TYPING, { rideId, isTyping });
  }

  /**
   * Debounces keypresses to manage the active typing indicator lifetime.
   */
  public handleKeyPress(rideId: string) {
    // Send typing status to backend immediately if not already active
    this.sendTypingIndicator(rideId, true);

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.sendTypingIndicator(rideId, false);
      this.typingTimeout = null;
    }, 2000); // Reset typing status after 2 seconds of inactivity
  }

  /**
   * Helper to trigger backend PUT /chat/{rideId}/read message read synchronization.
   */
  public markAsRead(rideId: string) {
    store.dispatch(chatApi.endpoints.markAsRead.initiate(rideId));
  }

  /**
   * Clean up listeners when needed.
   */
  public destroy() {
    socketService.off(CHAT_EVENTS.CHAT_RECEIVE);
    socketService.off(CHAT_EVENTS.CHAT_TYPING);
    socketService.off(CHAT_EVENTS.CHAT_READ);
  }
}

export const realtimeChatService = new RealtimeChatService();
export default realtimeChatService;
