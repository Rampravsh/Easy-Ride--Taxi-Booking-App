import { Document, Types } from 'mongoose';
import { 
  NotificationType, 
  DeliveryType, 
  NotificationStatus, 
  RecipientType 
} from '../../shared/enums';

export interface INotification {
  recipient: Types.ObjectId;
  recipientType: RecipientType;
  title: string;
  body: string;
  notificationType: NotificationType;
  deliveryType: DeliveryType[];
  status: NotificationStatus;
  metadata?: Record<string, any>;
  isRead: boolean;
  sentAt?: Date;
  readAt?: Date;
  failedReason?: string;
  retryCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}
