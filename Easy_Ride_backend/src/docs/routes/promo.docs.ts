import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { z } from 'zod';

/**
 * Promos API Documentation
 */

const PromoSchema = z.object({
  code: z.string(),
  discountType: z.enum(['PERCENTAGE', 'FLAT']),
  value: z.number(),
  maxDiscount: z.number().optional(),
  expiryDate: z.string().datetime(),
});

// GET /api/v1/promos
registry.registerPath({
  method: 'get',
  path: '/promos',
  summary: 'List Active Promos',
  description: 'Returns all valid promo codes available for the user.',
  tags: [SWAGGER_TAGS.PROMO],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(PromoSchema), 'Promos list retrieved'),
  },
});

// POST /api/v1/promos/apply
registry.registerPath({
  method: 'post',
  path: '/promos/apply',
  summary: 'Apply Promo Code',
  description: 'Validates and applies a promo code to a potential ride.',
  tags: [SWAGGER_TAGS.PROMO],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            code: z.string(),
            fare: z.number().describe('Original fare before discount'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        originalFare: z.number(),
        discountedFare: z.number(),
        savings: z.number(),
      }),
      'Promo applied successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Invalid or expired promo code'),
  },
});
