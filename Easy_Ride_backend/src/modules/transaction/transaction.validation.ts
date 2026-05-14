import { z } from 'zod';

export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
    status: z.string().optional(),
    type: z.string().optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({
    transactionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Transaction ID'),
  }),
});
