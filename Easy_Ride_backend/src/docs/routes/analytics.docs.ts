import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { z } from 'zod';

/**
 * Analytics API Documentation
 */

// GET /api/v1/analytics/overview
registry.registerPath({
  method: 'get',
  path: '/analytics/overview',
  summary: 'Get Real-Time Operations Overview',
  description: 'Retrieve real-time platform statistics for the current day, including total ride requests, active rides (accepted, arriving, started), completed rides, cancelled rides, and the calculated success rate. Requires Admin role with SUPER_ADMIN, ANALYTICS_ADMIN, or OPERATIONS_ADMIN scope.',
  tags: [SWAGGER_TAGS.ANALYTICS],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        totalRidesToday: z.number().int().nonnegative().describe('Total rides requested today'),
        activeRides: z.number().int().nonnegative().describe('Currently active rides on the road (ACCEPTED, ARRIVING, STARTED)'),
        completedRidesToday: z.number().int().nonnegative().describe('Rides successfully completed today'),
        cancelledRidesToday: z.number().int().nonnegative().describe('Rides cancelled today'),
        successRate: z.number().nonnegative().describe('Percentage of requested rides that were successfully completed'),
      }),
      'Operations overview metrics fetched successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing Firebase token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Analytics/Admin permissions required'),
  },
});

// GET /api/v1/analytics/revenue
registry.registerPath({
  method: 'get',
  path: '/analytics/revenue',
  summary: 'Get Revenue Metrics',
  description: 'Retrieve grouped daily revenue and fare metrics within a specified date range. Requires Admin role with SUPER_ADMIN, ANALYTICS_ADMIN, or FINANCE_ADMIN scope.',
  tags: [SWAGGER_TAGS.ANALYTICS],
  security: [{ firebaseAuth: [] }],
  parameters: [
    {
      name: 'startDate',
      in: 'query',
      required: true,
      schema: { type: 'string', format: 'date-time' },
      description: 'The starting date and time of the range (ISO 8601 string, e.g., 2026-05-01T00:00:00.000Z)',
    },
    {
      name: 'endDate',
      in: 'query',
      required: true,
      schema: { type: 'string', format: 'date-time' },
      description: 'The ending date and time of the range (ISO 8601 string, e.g., 2026-05-31T23:59:59.999Z)',
    },
  ],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.array(
        z.object({
          _id: z.string().describe('The date string of the revenue calculation (format: YYYY-MM-DD)'),
          totalRevenue: z.number().nonnegative().describe('Sum of total fares for completed rides on this day'),
          avgFare: z.number().nonnegative().describe('Average fare of completed rides on this day'),
          rideCount: z.number().int().nonnegative().describe('Count of completed rides on this day'),
        })
      ),
      'Revenue metrics fetched successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Bad Request - Invalid or missing date query parameters'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized - Invalid or missing token'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - Analytics/Admin permissions required'),
  },
});
