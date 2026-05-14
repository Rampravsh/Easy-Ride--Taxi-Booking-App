import { z } from 'zod';

export const refundSchema = z.object({
  body: z.object({
    transactionId: z.string().min(1, 'Transaction ID is required'),
    amount: z.number().positive().optional(),
    reason: z.string().optional(),
  }),
});
