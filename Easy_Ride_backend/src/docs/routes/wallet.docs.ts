import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { WalletSchema, TransactionSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Wallet API Documentation
 */

// GET /api/v1/wallet/balance
registry.registerPath({
  method: 'get',
  path: '/wallet/balance',
  summary: 'Get Wallet Balance',
  description: 'Retrieves current balance and currency for the authenticated user.',
  tags: [SWAGGER_TAGS.WALLET],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(WalletSchema, 'Balance retrieved successfully'),
  },
});

// GET /api/v1/wallet/transactions
registry.registerPath({
  method: 'get',
  path: '/wallet/transactions',
  summary: 'Get Wallet Transactions',
  description: 'Retrieves paginated transaction history for the authenticated user.',
  tags: [SWAGGER_TAGS.WALLET],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'page',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 1 },
    },
    {
      name: 'limit',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 10 },
    },
  ],
  responses: {
    200: RESPONSE_SCHEMAS.PAGINATED(TransactionSchema, 'Transactions retrieved successfully'),
  },
});
