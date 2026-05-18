import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { PromoSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Promos API Documentation
 */

// POST /api/v1/promos/validate
registry.registerPath({
  method: 'post',
  path: '/promos/validate',
  summary: 'Validate Promo Code',
  description: 'Validates a specific promo code against the current ride configuration (fare, rideType, operating city, expiry dates, and usage limits). Returns the full promo configuration if valid.',
  tags: [SWAGGER_TAGS.PROMO],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            code: z.string().min(1).describe('Promo code to validate (e.g. GETRIDE50)'),
            rideType: z.string().min(1).describe('Requested vehicle / ride type (e.g. bike, sedan)'),
            city: z.string().min(1).describe('Operating city for the ride'),
            fare: z.number().min(0).describe('Original pre-discount ride fare'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(PromoSchema, 'Promo code is valid'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid or expired promo code, or requirements not met'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/promos/apply
registry.registerPath({
  method: 'post',
  path: '/promos/apply',
  summary: 'Apply Promo Code to Ride Fare',
  description: 'Applies the promo discount rules to calculate the adjusted final fare, returned alongside savings details.',
  tags: [SWAGGER_TAGS.PROMO],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            code: z.string().min(1).describe('Promo code to apply'),
            rideType: z.string().min(1).describe('Requested ride/vehicle type'),
            city: z.string().min(1).describe('Operating city for the ride'),
            fare: z.number().min(0).describe('Original fare amount before discount'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        promoCode: z.string().describe('Applied promo code'),
        originalFare: z.number().describe('Original pre-discount fare'),
        discountAmount: z.number().describe('Calculated monetary discount savings'),
        finalFare: z.number().describe('Adjusted net fare amount to pay'),
        promoType: z.string().describe('Type of promo code applied (e.g. discount)'),
      }),
      'Promo code applied successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Invalid or expired promo code'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
