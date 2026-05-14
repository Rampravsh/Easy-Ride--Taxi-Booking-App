import logger from '../../../shared/utils/logger';

export class SmsProvider {
  static async sendSms(phone: string, message: string) {
    try {
      logger.info(`Sending SMS to ${phone}: ${message}`);
      // Integrate with Twilio or similar here
      return true;
    } catch (error) {
      logger.error('SMS Send Error:', error);
      throw error;
    }
  }
}
