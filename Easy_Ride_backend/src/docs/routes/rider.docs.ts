import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { UserSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Riders API Documentation
 */

// GET /api/v1/riders/profile
registry.registerPath({
  method: 'get',
  path: '/riders/profile',
  summary: 'Get Rider Profile',
  description: 'Returns rider-specific details including vehicle and rating.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      UserSchema.extend({
        riderRating: z.number(),
        totalRides: z.number(),
        vehicleId: z.string().uuid(),
      }),
      'Rider profile retrieved'
    ),
  },
});

// PATCH /api/v1/riders/status
registry.registerPath({
  method: 'patch',
  path: '/riders/status',
  summary: 'Update Rider Availability',
  description: 'Toggles rider status between ONLINE and OFFLINE.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['ONLINE', 'OFFLINE']),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({ status: z.string() }), 'Status updated'),
  },
});
