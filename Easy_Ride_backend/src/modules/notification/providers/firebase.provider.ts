import { firebaseMessaging } from '../../../config/firebase';
import logger from '../../../shared/utils/logger';

export class FirebaseProvider {
  /**
   * Send a push notification
   */
  async sendPushNotification(tokens: string[], title: string, body: string, data?: any) {
    if (tokens.length === 0) return;

    const message = {
      notification: { title, body },
      data: data || {},
      tokens,
    };

    try {
      const response = await firebaseMessaging.sendEachForMulticast(message);
      logger.info(`FCM Success: ${response.successCount}, Failure: ${response.failureCount}`);
      return response;
    } catch (error) {
      logger.error('FCM Provider Error:', error);
      throw error;
    }
  }
}
