import { Types } from 'mongoose';
import { Message } from './chat.model';
import { IMessage } from './chat.interface';
import { MessageStatus } from '../../shared/enums';

export class ChatRepository {
  /**
   * Create a new message
   */
  async createMessage(data: Partial<IMessage>) {
    return await Message.create(data);
  }

  /**
   * Get messages for a ride with pagination
   */
  async getMessagesByRide(rideId: string | Types.ObjectId, limit: number = 50, lastCreatedAt?: Date) {
    const query: any = { ride: rideId };
    if (lastCreatedAt) {
      query.createdAt = { $lt: lastCreatedAt };
    }

    return await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Mark messages as read
   */
  async markAsRead(rideId: string | Types.ObjectId, receiverId: string | Types.ObjectId) {
    return await Message.updateMany(
      { ride: rideId, receiver: receiverId, status: { $ne: MessageStatus.READ } },
      { status: MessageStatus.READ, readAt: new Date() }
    );
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string | Types.ObjectId) {
    return await Message.countDocuments({ receiver: userId, status: { $ne: MessageStatus.READ } });
  }

  /**
   * Update message status
   */
  async updateStatus(messageId: string | Types.ObjectId, status: MessageStatus) {
    const update: any = { status };
    if (status === MessageStatus.DELIVERED) update.deliveredAt = new Date();
    if (status === MessageStatus.READ) update.readAt = new Date();

    return await Message.findByIdAndUpdate(messageId, update, { new: true });
  }
}
