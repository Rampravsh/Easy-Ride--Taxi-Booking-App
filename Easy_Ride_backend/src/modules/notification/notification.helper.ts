import { NotificationType, DeliveryType } from '../../shared/enums';

export class NotificationHelper {
  /**
   * Determine default delivery types based on notification type
   */
  static getDefaultDeliveryTypes(type: NotificationType): DeliveryType[] {
    switch (type) {
      case NotificationType.RIDE_UPDATE:
        return [DeliveryType.PUSH, DeliveryType.IN_APP];
      case NotificationType.PAYMENT_UPDATE:
        return [DeliveryType.PUSH, DeliveryType.IN_APP, DeliveryType.EMAIL];
      case NotificationType.SYSTEM_ALERT:
        return [DeliveryType.PUSH, DeliveryType.IN_APP, DeliveryType.EMAIL, DeliveryType.SMS];
      default:
        return [DeliveryType.PUSH, DeliveryType.IN_APP];
    }
  }

  /**
   * Format metadata for FCM data payload (must be strings)
   */
  static formatFcmData(data: any): Record<string, string> {
    const formatted: Record<string, string> = {};
    if (!data) return formatted;

    Object.keys(data).forEach(key => {
      formatted[key] = typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]);
    });

    return formatted;
  }
}
