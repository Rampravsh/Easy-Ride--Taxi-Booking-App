import { firebaseMessaging } from '../../../config/firebase';
import logger from '../../../shared/utils/logger';

export class FirebaseProvider {
  /**
   * Send push notification to a single device
   */
  static async sendPush(token: string, title: string, body: string, data?: any) {
    try {
      const message = {
        notification: { title, body },
        data: data || {},
        token,
      };

      const response = await firebaseMessaging.send(message);
      return response;
    } catch (error: any) {
      logger.error('FCM Send Error:', error);
      throw error;
    }
  }

  /**
   * Send push notification to multiple devices
   */
  static async sendMulticast(tokens: string[], title: string, body: string, data?: any) {
    try {
      if (tokens.length === 0) return;

      const message = {
        notification: { title, body },
        data: data || {},
        tokens,
      };

      const response = await firebaseMessaging.sendEachForMulticast(message);
      
      // Cleanup logic for invalid tokens can be implemented here
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            logger.warn(`FCM Multicast failure for token ${tokens[idx]}:`, resp.error);
          }
        });
      }
      
      return response;
    } catch (error: any) {
      logger.error('FCM Multicast Error:', error);
      throw error;
    }
  }

  /**
   * Send notification to a topic
   */
  static async sendToTopic(topic: string, title: string, body: string, data?: any) {
    try {
      const message = {
        notification: { title, body },
        data: data || {},
        topic,
      };

      const response = await firebaseMessaging.send(message);
      return response;
    } catch (error: any) {
      logger.error('FCM Topic Send Error:', error);
      throw error;
    }
  }
}
