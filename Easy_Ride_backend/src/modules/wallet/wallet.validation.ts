import { z } from 'zod';

export const topupSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    paymentId: z.string().min(1, 'Payment ID is required'),
    signature: z.string().min(1, 'Signature is required'),
  }),
});
