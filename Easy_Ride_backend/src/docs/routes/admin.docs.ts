import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { UserSchema, TransactionSchema, AuditSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Admin API Documentation
 */

// GET /api/v1/admin/dashboard
registry.registerPath({
  method: 'get',
  path: '/admin/dashboard',
  summary: 'Get Platform Statistics',
  description: 'Retrieve platform-wide high-level metrics including total users, total riders, and online riders. Requires Admin role with any scope.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        totalUsers: z.number().int().describe('Total registered users'),
        totalRiders: z.number().int().describe('Total registered riders'),
        activeRiders: z.number().int().describe('Currently online and active riders'),
      }),
      'Platform stats fetched successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing Firebase token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Admin access required'),
  },
});

// PUT /api/v1/admin/riders/{id}/verify
registry.registerPath({
  method: 'put',
  path: '/admin/riders/{id}/verify',
  summary: 'Verify or Reject Rider',
  description: 'Approve or reject a rider\'s verification/KYC documents. Requires Admin role with SUPER_ADMIN, OPERATIONS_ADMIN, or SUPPORT_ADMIN scope.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'The unique identifier of the rider',
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['APPROVED', 'REJECTED']).describe('The new verification status of the rider'),
            reason: z.string().optional().describe('Reason for rejection (required if status is REJECTED)'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        _id: z.string(),
        verificationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
        isOnline: z.boolean(),
        isAvailable: z.boolean(),
      }).passthrough(),
      'Rider verification updated successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Bad Request - Invalid verification status or reason missing'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Insufficient admin permissions'),
    404: RESPONSE_SCHEMAS.ERROR('Rider not found'),
  },
});

// PUT /api/v1/admin/users/{id}/block
registry.registerPath({
  method: 'put',
  path: '/admin/users/{id}/block',
  summary: 'Block or Unblock User',
  description: 'Block or unblock a user account. Blocked users will not be able to log in or request rides. Requires Admin role with SUPER_ADMIN or SUPPORT_ADMIN scope.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'The unique identifier of the user to block/unblock',
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            isBlocked: z.boolean().describe('True to block the user, false to unblock'),
            reason: z.string().optional().describe('Reason for blocking the user account'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      UserSchema.extend({
        isBlocked: z.boolean(),
      }),
      'User account block status updated'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Insufficient admin permissions'),
    404: RESPONSE_SCHEMAS.ERROR('User not found'),
  },
});

// PUT /api/v1/admin/riders/{id}/block
registry.registerPath({
  method: 'put',
  path: '/admin/riders/{id}/block',
  summary: 'Block or Unblock Rider',
  description: 'Block or unblock a rider account. Blocked riders are set to REJECTED verification status and forced offline. Requires Admin role with SUPER_ADMIN or SUPPORT_ADMIN scope.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'The unique identifier of the rider to block/unblock',
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            isBlocked: z.boolean().describe('True to block the rider, false to unblock'),
            reason: z.string().optional().describe('Reason for blocking the rider account'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        _id: z.string(),
        verificationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
        isOnline: z.boolean(),
        isAvailable: z.boolean(),
      }).passthrough(),
      'Rider block status updated successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Insufficient admin permissions'),
    404: RESPONSE_SCHEMAS.ERROR('Rider not found'),
  },
});

// POST /api/v1/admin/refunds/{transactionId}
registry.registerPath({
  method: 'post',
  path: '/admin/refunds/{transactionId}',
  summary: 'Process Refund',
  description: 'Manually process a full or partial refund for a successful transaction. Attempts a payment gateway refund and records the transaction. Requires Admin role with SUPER_ADMIN or FINANCE_ADMIN scope.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'transactionId',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'The transaction ID to be refunded',
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            amount: z.number().positive().optional().describe('Refund amount. If omitted, the full transaction amount is refunded.'),
            reason: z.string().optional().describe('Detailed reason for the refund'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      TransactionSchema,
      'Refund processed successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Bad Request - Only successful transactions can be refunded'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Insufficient admin permissions'),
    404: RESPONSE_SCHEMAS.ERROR('Original transaction not found'),
  },
});

// GET /api/v1/admin/audit
registry.registerPath({
  method: 'get',
  path: '/admin/audit',
  summary: 'View Audit Logs',
  description: 'Retrieve platform audit logs detailing actions performed by administrators. Requires Admin role with SUPER_ADMIN scope.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'page',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 1 },
      description: 'The page number for pagination',
    },
    {
      name: 'limit',
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 20 },
      description: 'Number of audit logs to return per page',
    },
    {
      name: 'action',
      in: 'query',
      required: false,
      schema: { type: 'string' },
      description: 'Filter audit logs by specific action type',
    },
    {
      name: 'resource',
      in: 'query',
      required: false,
      schema: { type: 'string' },
      description: 'Filter audit logs by specific resource (e.g., user, rider, transaction)',
    },
  ],
  responses: {
    200: RESPONSE_SCHEMAS.PAGINATED(
      AuditSchema,
      'Audit log retrieved successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Insufficient admin permissions'),
  },
});
