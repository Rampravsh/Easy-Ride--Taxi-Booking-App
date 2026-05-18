import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { ReviewSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Ride Reviews and Ratings API Documentation
 */

// POST /api/v1/reviews
registry.registerPath({
  method: 'post',
  path: '/reviews',
  summary: 'Create a Ride Review',
  description: 'Submits a passenger or rider review rating for a completed ride. Authenticated user is automatically mapped as the reviewer.',
  tags: [SWAGGER_TAGS.REVIEW],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID of the completed trip'),
            receiverId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB ID of the user or rider being rated'),
            rating: z.number().min(1).max(5).describe('Star rating from 1 to 5 stars'),
            comment: z.string().max(500).optional().describe('Optional textual commentary feedback (max 500 characters)'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(ReviewSchema, 'Review created successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or invalid values provided'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/reviews/ride/{rideId}
registry.registerPath({
  method: 'get',
  path: '/reviews/ride/{rideId}',
  summary: 'Get Ride Reviews',
  description: 'Retrieves all reviews logged for a specific ride instance by its unique 24-character hexadecimal MongoDB Ride ID.',
  tags: [SWAGGER_TAGS.REVIEW],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(ReviewSchema), 'Ride reviews fetched successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Ride ID format'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/reviews/user/{userId}
registry.registerPath({
  method: 'get',
  path: '/reviews/user/{userId}',
  summary: 'Get User Reviews',
  description: 'Retrieves all reviews submitted ABOUT a specific user or rider profile (reviews where the user is the receiverId), useful for rating scores and profile feedback cards.',
  tags: [SWAGGER_TAGS.REVIEW],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      userId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB User/Rider ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(ReviewSchema), 'User reviews fetched successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid User ID format'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
