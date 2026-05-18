import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { ScheduleSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Ride Scheduling API Documentation
 */

// POST /api/v1/schedules
registry.registerPath({
  method: 'post',
  path: '/schedules',
  summary: 'Schedule a Future Ride',
  description: 'Creates a new scheduled ride record linked to an existing booked ride. Sets up automated activation timers and cancellation policies.',
  tags: [SWAGGER_TAGS.SCHEDULE || 'SCHEDULE'],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
            scheduledAt: z.string().datetime().describe('Future target ISO timestamp when the ride is set to occur'),
            autoAssigned: z.boolean().optional().default(true).describe('True to enable automated driver matching at execution threshold'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(ScheduleSchema, 'Ride scheduled successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or scheduling in past/invalid range'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/schedules
registry.registerPath({
  method: 'get',
  path: '/schedules',
  summary: 'List User Scheduled Rides',
  description: 'Retrieves all future active scheduled rides for the currently authenticated user.',
  tags: [SWAGGER_TAGS.SCHEDULE || 'SCHEDULE'],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(ScheduleSchema), 'Schedules fetched successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/schedules/{id}/cancel
registry.registerPath({
  method: 'put',
  path: '/schedules/{id}/cancel',
  summary: 'Cancel Scheduled Ride',
  description: 'Cancels a pending scheduled ride by its schedule ID. Validates cancellation constraints.',
  tags: [SWAGGER_TAGS.SCHEDULE || 'SCHEDULE'],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Schedule ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Schedule cancelled successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Schedule ID format or ride cannot be cancelled'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    404: RESPONSE_SCHEMAS.ERROR('Schedule not found'),
  },
});
