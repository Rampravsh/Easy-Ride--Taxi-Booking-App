import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { z } from 'zod';

/**
 * Chat API Documentation
 */

const MessageSchema = z.object({
  id: z.string().uuid(),
  rideId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  createdAt: z.string().datetime(),
});

// GET /api/v1/chat/:rideId
registry.registerPath({
  method: 'get',
  path: '/chat/{rideId}',
  summary: 'Get Chat History',
  description: 'Retrieves all messages for a specific ride.',
  tags: [SWAGGER_TAGS.CHAT],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'rideId',
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' },
    },
  ],
  responses: {
    200: RESPONSE_SCHEMAS.PAGINATED(MessageSchema, 'Chat history retrieved'),
  },
});
