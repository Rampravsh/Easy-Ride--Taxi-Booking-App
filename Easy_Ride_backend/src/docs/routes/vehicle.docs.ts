import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { z } from 'zod';

/**
 * Vehicles API Documentation
 */

const VehicleSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['BIKE', 'AUTO', 'CAR', 'PREMIUM']),
  model: z.string(),
  plateNumber: z.string(),
  color: z.string(),
  riderId: z.string().uuid(),
});

// GET /api/v1/vehicles
registry.registerPath({
  method: 'get',
  path: '/vehicles',
  summary: 'List Available Vehicle Types',
  description: 'Returns all vehicle categories supported by the platform.',
  tags: [SWAGGER_TAGS.VEHICLE],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.array(
        z.object({
          type: z.string(),
          baseFare: z.number(),
          perKm: z.number(),
        })
      ),
      'Vehicles list retrieved'
    ),
  },
});
