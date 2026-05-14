import { NotificationType, DeliveryType, RecipientType } from '../../shared/enums';

export type SendNotificationParams = {
  recipientId: string;
  recipientType: RecipientType;
  title: string;
  body: string;
  notificationType: NotificationType;
  deliveryType: DeliveryType[];
  data?: any;
  delay?: number;
};

export type NotificationJobData = {
  notificationId: string;
  tokens: string[];
  email?: string;
  phone?: string;
  title: string;
  body: string;
  data?: any;
  deliveryType: DeliveryType[];
};
