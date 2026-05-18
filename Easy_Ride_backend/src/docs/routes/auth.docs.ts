import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { z } from 'zod';

/**
 * Authentication API Documentation
 */

// POST /api/v1/auth/firebase
registry.registerPath({
  method: 'post',
  path: '/auth/firebase',
  summary: 'Authenticate with Firebase',
  description: 'Exchanges a Firebase ID Token for a session. If the user does not exist, a new account is automatically created with the requested role. For riders, a pending rider profile is also generated. Returns essential authenticated user details.',
  tags: [SWAGGER_TAGS.AUTH],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string().describe('Firebase ID Token obtained from the Firebase client SDK'),
            role: z.enum(['user', 'rider', 'admin']).describe('Desired role for this session (must be lowercase)'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        _id: z.string().describe('MongoDB user identifier'),
        firebaseUID: z.string().describe('Firebase UID'),
        role: z.enum(['user', 'rider', 'admin']).describe('User role'),
        name: z.string().describe('Full name of the user'),
        email: z.string().email().nullable().optional().describe('Email address'),
        phone: z.string().nullable().optional().describe('Phone number'),
      }),
      'Authenticated successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Invalid or expired Firebase ID token'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed - missing token or invalid role'),
  },
});
