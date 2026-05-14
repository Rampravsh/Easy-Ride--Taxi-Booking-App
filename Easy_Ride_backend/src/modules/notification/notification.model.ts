import { Schema, model } from 'mongoose';
import { INotificationDocument } from './notification.interface';
import { 
  NotificationType, 
  DeliveryType, 
  NotificationStatus, 
  RecipientType 
} from '../../shared/enums';

const notificationSchema = new Schema<INotificationDocument>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientType',
    },
    recipientType: {
      type: String,
      enum: Object.values(RecipientType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    deliveryType: [
      {
        type: String,
        enum: Object.values(DeliveryType),
      },
    ],
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
    failedReason: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = model<INotificationDocument>('Notification', notificationSchema);
