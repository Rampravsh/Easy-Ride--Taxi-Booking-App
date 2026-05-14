import { Types } from 'mongoose';
import { ChatRepository } from './chat.repository';
import { MessageType, MessageStatus } from '../../shared/enums';
import Ride from '../ride/ride.model';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import { getIO } from '../../config/socket';
import { SOCKET_ROOMS, SocketEvents } from '../../sockets/socket.constants';

export class ChatService {
  private repository: ChatRepository;

  constructor() {
    this.repository = new ChatRepository();
  }

  /**
   * Send a message
   */
  async sendMessage(params: {
    rideId: string;
    senderId: string;
    content: string;
    messageType?: MessageType;
    metadata?: any;
  }) {
    const { rideId, senderId, content, messageType, metadata } = params;

    // 1. Validate ride and participants
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new ApiError('Ride not found', httpStatus.NOT_FOUND);
    }

    const isUser = ride.user.toString() === senderId;
    const isRider = ride.rider?.toString() === senderId;

    if (!isUser && !isRider) {
      throw new ApiError('You are not a participant in this ride chat', httpStatus.FORBIDDEN);
    }

    const receiverId = isUser ? ride.rider?.toString() : ride.user.toString();
    if (!receiverId) {
      throw new ApiError('Receiver not found', httpStatus.BAD_REQUEST);
    }

    // 2. Persist message
    const message = await this.repository.createMessage({
      ride: new Types.ObjectId(rideId),
      sender: new Types.ObjectId(senderId),
      receiver: new Types.ObjectId(receiverId),
      content,
      messageType: messageType || MessageType.TEXT,
      status: MessageStatus.SENT,
      metadata,
    });

    // 3. Emit to receiver via Socket.io
    const io = getIO();
    io.to(SOCKET_ROOMS.USER(receiverId)).to(SOCKET_ROOMS.RIDER(receiverId)).emit(SocketEvents.CHAT_RECEIVE, message);

    return message;
  }

  /**
   * Get message history
   */
  async getMessages(rideId: string, userId: string, limit: number = 50, lastCreatedAt?: Date) {
    // Validate participation
    const ride = await Ride.findById(rideId);
    if (!ride || (ride.user.toString() !== userId && ride.rider?.toString() !== userId)) {
      throw new ApiError('Access denied', httpStatus.FORBIDDEN);
    }

    return await this.repository.getMessagesByRide(rideId, limit, lastCreatedAt);
  }

  /**
   * Mark messages as read
   */
  async markAsRead(rideId: string, userId: string) {
    await this.repository.markAsRead(rideId, userId);
    
    // Notify sender that messages are read
    const ride = await Ride.findById(rideId);
    const senderId = ride?.user.toString() === userId ? ride?.rider?.toString() : ride?.user.toString();
    
    if (senderId) {
      const io = getIO();
      io.to(SOCKET_ROOMS.USER(senderId)).to(SOCKET_ROOMS.RIDER(senderId)).emit(SocketEvents.CHAT_READ, { rideId, readerId: userId });
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    return await this.repository.getUnreadCount(userId);
  }
}
