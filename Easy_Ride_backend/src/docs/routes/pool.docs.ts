import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { PoolSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Ride Pooling API Documentation
 */

// POST /api/v1/pool/join
registry.registerPath({
  method: 'post',
  path: '/pool/join',
  summary: 'Join or Create a Ride Pool',
  description: 'Joins an existing active ride pool matching the main ride, or automatically initializes a new pooling instance if none exists. Dedicts the seats and calculates standard pooling fares.',
  tags: [SWAGGER_TAGS.POOL],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID of the main ride'),
            pickup: z.object({
              coordinates: z.array(z.number()).length(2).describe('Longitude and Latitude coordinates of pickup [lng, lat]'),
              address: z.string().describe('Readable pickup address string'),
            }).describe('Pickup coordinates and address'),
            drop: z.object({
              coordinates: z.array(z.number()).length(2).describe('Longitude and Latitude coordinates of drop [lng, lat]'),
              address: z.string().describe('Readable drop address string'),
            }).describe('Drop coordinates and address'),
            seats: z.number().min(1).max(4).describe('Number of seats requested for the pooling passenger (1 to 4)'),
            fare: z.number().min(0).describe('Offered or pre-calculated pooling fare'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(PoolSchema, 'Joined pool successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or not enough available seats'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/pool/leave
registry.registerPath({
  method: 'post',
  path: '/pool/leave',
  summary: 'Leave a Ride Pool',
  description: 'Leaves/un-registers from an active ride pool. Automatically recalculates available seat counts and notifies the pool rider/passengers via sockets.',
  tags: [SWAGGER_TAGS.POOL],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            poolId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Pool ID'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Left pool successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or user is not a participant of this pool'),
    404: RESPONSE_SCHEMAS.ERROR('Pool not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
