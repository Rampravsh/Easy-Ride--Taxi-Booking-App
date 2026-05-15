import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { TransactionSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Payment API Documentation (Razorpay)
 */

// POST /api/v1/payments/create-order
registry.registerPath({
  method: 'post',
  path: '/payments/create-order',
  summary: 'Create Razorpay Order',
  description: 'Initiates a payment order for wallet top-up.',
  tags: [SWAGGER_TAGS.PAYMENT],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            amount: z.number().positive().describe('Amount in INR'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        orderId: z.string(),
        amount: z.number(),
        currency: z.string(),
      }),
      'Order created successfully'
    ),
  },
});

// POST /api/v1/payments/verify
registry.registerPath({
  method: 'post',
  path: '/payments/verify',
  summary: 'Verify Razorpay Payment',
  description: 'Verifies the payment signature and updates wallet balance.',
  tags: [SWAGGER_TAGS.PAYMENT],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            razorpayOrderId: z.string(),
            razorpayPaymentId: z.string(),
            razorpaySignature: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(TransactionSchema, 'Payment verified and wallet updated'),
    400: RESPONSE_SCHEMAS.ERROR('Signature verification failed'),
  },
});
