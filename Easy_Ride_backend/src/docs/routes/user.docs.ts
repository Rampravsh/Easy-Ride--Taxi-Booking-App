import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { UserSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * User API Documentation
 */

// GET /api/v1/users/profile
registry.registerPath({
  method: 'get',
  path: '/users/profile',
  summary: 'Get Current User Profile',
  description: 'Returns profile details of the currently authenticated user.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Profile retrieved successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PATCH /api/v1/users/profile
registry.registerPath({
  method: 'patch',
  path: '/users/profile',
  summary: 'Update User Profile',
  description: 'Updates profile information like name, phone, or profile image.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            phoneNumber: z.string().optional(),
            profileImage: z.string().url().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Profile updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
  },
});
