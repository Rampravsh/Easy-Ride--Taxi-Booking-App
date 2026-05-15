import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { z } from 'zod';

/**
 * Notifications API Documentation
 */

const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  type: z.string(),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
});

// GET /api/v1/notifications
registry.registerPath({
  method: 'get',
  path: '/notifications',
  summary: 'Get Notifications',
  description: 'Retrieves a paginated list of notifications for the user.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.PAGINATED(NotificationSchema, 'Notifications retrieved'),
  },
});

// PATCH /api/v1/notifications/read-all
registry.registerPath({
  method: 'patch',
  path: '/notifications/read-all',
  summary: 'Mark All as Read',
  description: 'Updates all notifications status to read.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'All notifications marked as read'),
  },
});
