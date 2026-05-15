import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { RideSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Rides API Documentation
 */

// POST /api/v1/rides/estimate
registry.registerPath({
  method: 'post',
  path: '/rides/estimate',
  summary: 'Get Ride Fare Estimate',
  description: 'Calculates fare estimates for various vehicle types between pickup and drop locations.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            pickup: z.object({
              address: z.string(),
              latitude: z.number(),
              longitude: z.number(),
            }),
            drop: z.object({
              address: z.string(),
              latitude: z.number(),
              longitude: z.number(),
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.array(
        z.object({
          vehicleType: z.string(),
          estimatedFare: z.number(),
          estimatedDistance: z.number(),
          estimatedDuration: z.number(),
        })
      ),
      'Estimates retrieved successfully'
    ),
  },
});

// POST /api/v1/rides/book
registry.registerPath({
  method: 'post',
  path: '/rides/book',
  summary: 'Book a Ride',
  description: 'Creates a new ride request and notifies nearby riders.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            pickup: z.object({
              address: z.string(),
              latitude: z.number(),
              longitude: z.number(),
            }),
            drop: z.object({
              address: z.string(),
              latitude: z.number(),
              longitude: z.number(),
            }),
            vehicleType: z.string(),
            paymentMethod: z.enum(['WALLET', 'CASH', 'CARD']),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride booked successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Insufficient balance or invalid request'),
  },
});

// GET /api/v1/rides/history
registry.registerPath({
  method: 'get',
  path: '/rides/history',
  summary: 'Get Ride History',
  description: 'Retrieves a paginated list of past rides for the authenticated user.',
  tags: [SWAGGER_TAGS.RIDE],
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
    200: RESPONSE_SCHEMAS.PAGINATED(RideSchema, 'History retrieved successfully'),
  },
});
