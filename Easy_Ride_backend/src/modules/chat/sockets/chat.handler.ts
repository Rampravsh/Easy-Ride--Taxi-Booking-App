import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../../../sockets/socket.types';
import { ChatService } from '../chat.service';
import { SocketEvents, SOCKET_ROOMS } from '../../../sockets/socket.constants';
import logger from '../../../shared/utils/logger';

export class ChatHandler {
  private chatService: ChatService;

  constructor(private io: Server, private socket: AuthenticatedSocket) {
    this.chatService = new ChatService();
  }

  /**
   * Handle typing indicator
   */
  async handleTyping(payload: { rideId: string; isTyping: boolean }) {
    const { rideId, isTyping } = payload;
    const userId = this.socket.data.userId;

    // Broadcast typing state to the ride room (excluding self)
    this.socket.to(SOCKET_ROOMS.RIDE(rideId)).emit(SocketEvents.CHAT_TYPING, {
      rideId,
      userId,
      isTyping,
    });
  }

  /**
   * Handle read receipt
   */
  async handleReadReceipt(payload: { rideId: string }) {
    const { rideId } = payload;
    const userId = this.socket.data.userId;

    try {
      await this.chatService.markAsRead(rideId, userId);
    } catch (error) {
      logger.error('Error handling read receipt:', error);
    }
  }
}
