/**
 * Supported Notification Category types in the system.
 */
export type NotificationType =
  | 'ride_update'
  | 'payment_update'
  | 'refund_update'
  | 'chat_message'
  | 'call_notification'
  | 'promo'
  | 'reminder'
  | 'system_alert'
  | 'fraud_alert'
  | 'schedule_reminder';

/**
 * Dispatch delivery channels supported by backend queues.
 */
export type DeliveryType = 'push' | 'email' | 'sms' | 'in_app';

/**
 * Dispatch status flag of a given notification log.
 */
export type NotificationStatus = 'pending' | 'queued' | 'sent' | 'delivered' | 'failed' | 'read';

/**
 * Enterprise Notification schema matching strictly the backend NotificationSchema.
 */
export interface Notification {
  _id: string;
  recipient: string;
  recipientType: 'user' | 'rider' | 'admin';
  title: string;
  body: string;
  notificationType: NotificationType;
  deliveryType: DeliveryType[];
  status: NotificationStatus;
  metadata?: any;
  isRead: boolean;
  sentAt: string | null;
  readAt: string | null;
  failedReason?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload returning unread counts of notifications.
 */
export interface UnreadNotificationCount {
  count: number;
}

/**
 * Ride-specific notification alias.
 */
export type RideNotification = Notification;

