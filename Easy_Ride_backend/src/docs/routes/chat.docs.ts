import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { MessageSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Chat API Documentation
 */

// POST /api/v1/chat/send
registry.registerPath({
  method: 'post',
  path: '/chat/send',
  summary: 'Send a Message',
  description: 'Sends a chat message related to a ride. In addition to saving in the database, this triggers a real-time SOCKET event `chat:message_received` to the receiver.',
  tags: [SWAGGER_TAGS.CHAT],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
            content: z.string().min(1).describe('The text body of the message or file URL (if media)'),
            messageType: z.enum(['text', 'image', 'audio', 'location', 'system']).optional().default('text').describe('Type of the message'),
            metadata: z.record(z.string(), z.any()).optional().describe('Optional key-value metadata (e.g. image width/height, GPS coords)'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(MessageSchema, 'Message sent successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed - invalid parameters'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/chat/{rideId}/messages
registry.registerPath({
  method: 'get',
  path: '/chat/{rideId}/messages',
  summary: 'Get Chat Messages History',
  description: 'Retrieves a paginated list of chat messages for a specific ride, ordered by creation time descending.',
  tags: [SWAGGER_TAGS.CHAT],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
    query: z.object({
      limit: z.string().optional().describe('Maximum number of messages to fetch (default: 50)'),
      lastCreatedAt: z.string().optional().describe('ISO timestamp of the last fetched message for cursor-based pagination'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(MessageSchema), 'Chat history retrieved successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed - invalid Ride ID'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/chat/unread-count
registry.registerPath({
  method: 'get',
  path: '/chat/unread-count',
  summary: 'Get Unread Messages Count',
  description: 'Gets the total count of unread chat messages across all active rides for the authenticated user.',
  tags: [SWAGGER_TAGS.CHAT],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        count: z.number().describe('Total number of unread messages'),
      }),
      'Unread message count retrieved successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/chat/{rideId}/read
registry.registerPath({
  method: 'put',
  path: '/chat/{rideId}/read',
  summary: 'Mark Ride Messages as Read',
  description: 'Marks all unread messages in a specific ride chat as read. Updates the status to `read` and sets `readAt` timestamp.',
  tags: [SWAGGER_TAGS.CHAT],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({}),
      'Messages marked as read successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed - invalid Ride ID'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
