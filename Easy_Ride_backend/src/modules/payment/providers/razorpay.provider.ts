import razorpay from '../../../config/razorpay';
import crypto from 'crypto';
import { ApiError } from '../../../shared/errors/ApiError';


import httpStatus from 'http-status';

export class RazorpayProvider {

  /**
   * Create a new order in Razorpay
   */
  static async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    try {
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt,
      };
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error: any) {
      throw new ApiError(`Razorpay Order Error: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Verify Razorpay Signature
   */
  static verifySignature(orderId: string, paymentId: string, signature: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generated_signature === signature;
  }

  /**
   * Verify Webhook Signature
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return expectedSignature === signature;
  }

  /**
   * Initiate a refund
   */
  static async createRefund(paymentId: string, amount?: number, speed: 'normal' | 'optimum' = 'normal') {
    try {
      const options: any = {
        payment_id: paymentId,
        speed,
      };
      if (amount) {
        options.amount = Math.round(amount * 100);
      }
      return await razorpay.payments.refund(paymentId, options);
    } catch (error: any) {
      throw new ApiError(`Razorpay Refund Error: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Fetch payment details
   */
  static async fetchPayment(paymentId: string) {
    try {
      return await razorpay.payments.fetch(paymentId);
    } catch (error: any) {
      throw new ApiError(`Razorpay Fetch Error: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
