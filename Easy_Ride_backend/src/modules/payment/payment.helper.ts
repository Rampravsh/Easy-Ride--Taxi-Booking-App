import crypto from 'crypto';

/**
 * Payment Helper
 */
export class PaymentHelper {
  /**
   * Generate HMAC signature for internal verification
   */
  static generateInternalSignature(data: string, secret: string) {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  /**
   * Mask sensitive payment info for logging
   */
  static maskCardNumber(cardNumber: string) {
    return cardNumber.replace(/\d(?=\d{4})/g, "*");
  }
}
