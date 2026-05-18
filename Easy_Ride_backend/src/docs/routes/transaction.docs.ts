import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { TransactionSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Transactions History API Documentation
 */

// GET /api/v1/transactions
registry.registerPath({
  method: 'get',
  path: '/transactions',
  summary: 'Get Transaction History',
  description: 'Retrieves a paginated list of all credit, debit, refund, and payment transactions associated with the authenticated user, sorted by creation date descending.',
  tags: [SWAGGER_TAGS.TRANSACTION],
  security: [{ firebaseAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().describe('Page number (defaults to 1)'),
      limit: z.string().optional().describe('Number of records per page (defaults to 20)'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(TransactionSchema), 'Transactions history fetched successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/transactions/{transactionId}
registry.registerPath({
  method: 'get',
  path: '/transactions/{transactionId}',
  summary: 'Get Transaction Details',
  description: 'Retrieves comprehensive details of a specific transaction by its 24-character hexadecimal MongoDB Transaction ID.',
  tags: [SWAGGER_TAGS.TRANSACTION],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      transactionId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Transaction ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(TransactionSchema, 'Transaction details fetched successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Transaction ID format'),
    404: RESPONSE_SCHEMAS.ERROR('Transaction not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
