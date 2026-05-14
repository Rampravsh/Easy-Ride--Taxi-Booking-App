import { Types } from 'mongoose';
import { NotificationRepository } from './notification.repository';
import { notificationQueue } from './queues/notification.queue';
import { 
  NotificationType, 
  DeliveryType, 
  NotificationStatus, 
  RecipientType 
} from '../../shared/enums';
import User from '../user/user.model';
import Rider from '../rider/rider.model';
import logger from '../../shared/utils/logger';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';

export class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  /**
   * Main method to send a notification (Queued)
   */
  async sendNotification(params: {
    recipientId: string | Types.ObjectId;
    recipientType: RecipientType;
    title: string;
    body: string;
    notificationType: NotificationType;
    deliveryType: DeliveryType[];
    data?: any;
    delay?: number;
  }) {
    const { 
      recipientId, 
      recipientType, 
      title, 
      body, 
      notificationType, 
      deliveryType, 
      data, 
      delay 
    } = params;

    // 1. Fetch recipient to get device tokens, email, phone
    const recipient = await this.fetchRecipient(recipientId, recipientType);
    if (!recipient) {
      throw new ApiError('Recipient not found', httpStatus.NOT_FOUND);
    }

    // 2. Create Notification Record in DB
    const notification = await this.repository.create({
      recipient: new Types.ObjectId(recipientId),
      recipientType,
      title,
      body,
      notificationType,
      deliveryType,
      status: NotificationStatus.QUEUED,
      metadata: data,
    });

    // 3. Add Job to Queue
    await notificationQueue.add(
      'send-notification',
      {
        notificationId: notification._id,
        tokens: recipient.deviceTokens || [],
        email: recipient.email,
        phone: recipient.phone,
        title,
        body,
        data,
        deliveryType,
      },
      { delay: delay || 0 }
    );

    return notification;
  }

  /**
   * Register a device token
   */
  async registerDeviceToken(userId: string, recipientType: RecipientType, token: string) {
    const Model = recipientType === RecipientType.RIDER ? Rider : User;
    
    return await (Model as any).findOneAndUpdate(
      { _id: userId },
      { $addToSet: { deviceTokens: token } },
      { new: true }
    );
  }

  /**
   * Remove a device token (logout/cleanup)
   */
  async removeDeviceToken(userId: string, recipientType: RecipientType, token: string) {
    const Model = recipientType === RecipientType.RIDER ? Rider : User;
    
    return await (Model as any).findOneAndUpdate(
      { _id: userId },
      { $pull: { deviceTokens: token } },
      { new: true }
    );
  }


  /**
   * Get notification history
   */
  async getHistory(recipientId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await this.repository.getByRecipient(recipientId, limit, skip);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(recipientId: string) {
    return await this.repository.getUnreadCount(recipientId);
  }

  /**
   * Mark as read
   */
  async markAsRead(notificationId: string) {
    return await this.repository.markAsRead(notificationId);
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(recipientId: string) {
    return await this.repository.markAllAsRead(recipientId);
  }

  /**
   * Internal helper to fetch recipient details
   */
  private async fetchRecipient(id: string | Types.ObjectId, type: RecipientType) {
    if (type === RecipientType.RIDER) {
      return await Rider.findById(id).select('email phone deviceTokens');
    }
    return await User.findById(id).select('email phone deviceTokens');
  }
}
