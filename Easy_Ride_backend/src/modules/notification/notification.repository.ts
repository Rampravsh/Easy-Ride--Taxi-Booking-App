import { Types } from 'mongoose';
import { Notification } from './notification.model';
import { INotification } from './notification.interface';
import { NotificationStatus } from '../../shared/enums';

export class NotificationRepository {
  /**
   * Create a notification record
   */
  async create(data: Partial<INotification>) {
    return await Notification.create(data);
  }

  /**
   * Find notification by ID
   */
  async findById(id: string | Types.ObjectId) {
    return await Notification.findById(id);
  }

  /**
   * Get notification history for a recipient
   */
  async getByRecipient(recipientId: string | Types.ObjectId, limit: number = 20, skip: number = 0) {
    return await Notification.find({ recipient: recipientId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  /**
   * Get unread count for a recipient
   */
  async getUnreadCount(recipientId: string | Types.ObjectId) {
    return await Notification.countDocuments({ recipient: recipientId, isRead: false });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string | Types.ObjectId) {
    return await Notification.findByIdAndUpdate(id, {
      isRead: true,
      readAt: new Date(),
      status: NotificationStatus.READ,
    }, { new: true });
  }

  /**
   * Mark all as read for a recipient
   */
  async markAllAsRead(recipientId: string | Types.ObjectId) {
    return await Notification.updateMany(
      { recipient: recipientId, isRead: false },
      { isRead: true, readAt: new Date(), status: NotificationStatus.READ }
    );
  }

  /**
   * Update status
   */
  async updateStatus(id: string | Types.ObjectId, status: NotificationStatus, failedReason?: string) {
    const update: any = { status };
    if (failedReason) update.failedReason = failedReason;
    return await Notification.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * Delete a notification
   */
  async delete(id: string | Types.ObjectId) {
    return await Notification.findByIdAndDelete(id);
  }
}
