import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { NotificationSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Notifications API Documentation
 */

// GET /api/v1/notifications
registry.registerPath({
  method: 'get',
  path: '/notifications',
  summary: 'Get Notifications History',
  description: 'Retrieves a paginated list of notifications for the currently logged-in user or rider, sorted by creation date descending.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().describe('Page number (defaults to 1)'),
      limit: z.string().optional().describe('Number of records per page (defaults to 20)'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(NotificationSchema), 'Notifications history retrieved successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/notifications/unread-count
registry.registerPath({
  method: 'get',
  path: '/notifications/unread-count',
  summary: 'Get Unread Notifications Count',
  description: 'Gets the total count of unread notifications for the currently authenticated user.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        count: z.number().describe('Number of unread notifications'),
      }),
      'Unread count fetched successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/notifications/{id}/read
registry.registerPath({
  method: 'put',
  path: '/notifications/{id}/read',
  summary: 'Mark Notification as Read',
  description: 'Marks a specific notification as read, updating its `isRead` flag to true and setting the `readAt` timestamp.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Notification ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(NotificationSchema, 'Notification marked as read successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Notification ID format'),
    404: RESPONSE_SCHEMAS.ERROR('Notification not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/notifications/read-all
registry.registerPath({
  method: 'put',
  path: '/notifications/read-all',
  summary: 'Mark All Notifications as Read',
  description: 'Marks all unread notifications for the currently authenticated user as read.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'All notifications marked as read successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// DELETE /api/v1/notifications/{id}
registry.registerPath({
  method: 'delete',
  path: '/notifications/{id}',
  summary: 'Delete Notification',
  description: 'Removes a specific notification from the user\'s history.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Notification ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Notification deleted successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Notification ID format'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/notifications/register-token
registry.registerPath({
  method: 'post',
  path: '/notifications/register-token',
  summary: 'Register FCM Device Token',
  description: 'Registers the device\'s Firebase Cloud Messaging (FCM) token to send push notifications. Associates the token with either the `user` or `rider` profile depending on the specified type.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string().min(1).describe('Firebase Cloud Messaging (FCM) registration token'),
            type: z.enum(['user', 'rider', 'admin']).optional().default('user').describe('User type / role for device registration'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Device token registered successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed - missing token or invalid type'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/notifications/remove-token
registry.registerPath({
  method: 'post',
  path: '/notifications/remove-token',
  summary: 'Remove FCM Device Token',
  description: 'De-registers/removes the device\'s Firebase Cloud Messaging (FCM) token from the user\'s profile during logout or cleanup to stop receiving push notifications.',
  tags: [SWAGGER_TAGS.NOTIFICATION],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string().min(1).describe('Firebase Cloud Messaging (FCM) token to remove'),
            type: z.enum(['user', 'rider', 'admin']).optional().default('user').describe('User type / role of device token'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Device token removed successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed - missing token'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
