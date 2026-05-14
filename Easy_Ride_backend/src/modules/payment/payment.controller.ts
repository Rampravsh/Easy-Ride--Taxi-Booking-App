import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import httpStatus from 'http-status';
import { AuthRequest } from '../../shared/types/express.types';
import { ApiError } from '../../shared/errors/ApiError';

const paymentService = new PaymentService();

export class PaymentController {
  /**
   * Create Razorpay Order for Topup
   */
  static createTopupOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }
    const { amount } = req.body;
    const order = await paymentService.createTopupOrder(userId.toString(), amount);
    return ApiResponse.success(res, 'Order created successfully', order, httpStatus.CREATED);
  });

  /**
   * Verify Topup Payment
   */
  static verifyTopupPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }
    const { orderId, paymentId, signature } = req.body;
    const result = await paymentService.verifyTopupPayment(userId.toString(), orderId, paymentId, signature);
    return ApiResponse.success(res, 'Payment verified successfully', result);
  });

  /**
   * Process Refund (Admin/System only ideally)
   */
  static refundPayment = asyncHandler(async (req: Request, res: Response) => {
    const { transactionId, amount, reason } = req.body;
    const result = await paymentService.processRefund(transactionId, amount, reason);
    return ApiResponse.success(res, 'Refund processed successfully', result);
  });


  /**
   * Razorpay Webhook Handler
   */
  static razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
    // Handle webhooks for asynchronous payment success, refunds, etc.
    // This is a placeholder for a more complex webhook handling logic
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    
    // Logic to verify and handle webhook events
    // For now, return 200 to acknowledge
    return ApiResponse.success(res, 'Webhook received', {});
  });
}
