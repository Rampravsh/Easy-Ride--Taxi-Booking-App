import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { WalletSchema, TransactionSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Wallet API Documentation
 */

// GET /api/v1/wallet
registry.registerPath({
  method: 'get',
  path: '/wallet',
  summary: 'Get Wallet Details',
  description: 'Retrieves balance, currency, blocked status, and metadata of the authenticated passenger/rider\'s wallet. Automatically creates a wallet record if it does not exist.',
  tags: [SWAGGER_TAGS.WALLET],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(WalletSchema, 'Wallet details retrieved successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/wallet/transactions
registry.registerPath({
  method: 'get',
  path: '/wallet/transactions',
  summary: 'Get Wallet Transactions History',
  description: 'Retrieves a paginated list of wallet credits, debits, refunds, and adjustments for the authenticated user.',
  tags: [SWAGGER_TAGS.WALLET],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'page',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 1 },
      description: 'Page number of transactions log to fetch',
    },
    {
      name: 'limit',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 20 },
      description: 'Number of transaction entries per page',
    },
  ],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        docs: z.array(TransactionSchema),
        totalDocs: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        page: z.number(),
        pagingCounter: z.number(),
        hasPrevPage: z.boolean(),
        hasNextPage: z.boolean(),
        prevPage: z.number().nullable(),
        nextPage: z.number().nullable(),
      }),
      'Transactions history retrieved successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
