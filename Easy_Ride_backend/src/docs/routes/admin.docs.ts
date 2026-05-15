import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { UserSchema, RideSchema } from '../swagger/swagger.schemas';

/**
 * Admin API Documentation
 */

// GET /api/v1/admin/users
registry.registerPath({
  method: 'get',
  path: '/admin/users',
  summary: 'List All Users',
  description: 'Returns a list of all users in the system. Required Admin privileges.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'role',
      in: 'query',
      required: false,
      schema: { type: 'string', enum: ['USER', 'RIDER', 'ADMIN'] },
    },
  ],
  responses: {
    200: RESPONSE_SCHEMAS.PAGINATED(UserSchema, 'Users list retrieved'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Admin access required'),
  },
});

// GET /api/v1/admin/rides
registry.registerPath({
  method: 'get',
  path: '/admin/rides',
  summary: 'Monitor All Rides',
  description: 'Real-time overview of all rides. Required Admin privileges.',
  tags: [SWAGGER_TAGS.ADMIN],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.PAGINATED(RideSchema, 'Rides list retrieved'),
  },
});
