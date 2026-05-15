import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { UserSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Authentication API Documentation
 */

// POST /api/v1/auth/firebase
registry.registerPath({
  method: 'post',
  path: '/auth/firebase',
  summary: 'Authenticate with Firebase',
  description: 'Exchanges a Firebase ID Token for a session and returns user details.',
  tags: [SWAGGER_TAGS.AUTH],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string().describe('Firebase ID Token obtained from client SDK'),
            role: z.enum(['USER', 'RIDER']).describe('Desired role for this session'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Authenticated successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Invalid or expired Firebase token'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
  },
});

// POST /api/v1/auth/logout
registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  summary: 'Logout User',
  description: 'Invalidates the current session and clears cookies.',
  tags: [SWAGGER_TAGS.AUTH],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Logged out successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
