import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { z } from 'zod';

/**
 * System Health & Monitoring API Documentation
 */

// GET /api/v1/monitoring/health
registry.registerPath({
  method: 'get',
  path: '/monitoring/health',
  summary: 'System Health Check',
  description: 'Liveness and readiness checks for core platform dependencies (MongoDB, Redis, Firebase). Returns 200 OK if all essential services are UP, otherwise returns 503 Service Unavailable if any core services are DOWN or DEGRADED.',
  tags: [SWAGGER_TAGS.SYSTEM],
  responses: {
    200: {
      description: 'System is fully operational',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().describe('True if all vital services are UP'),
            status: z.enum(['UP', 'DEGRADED', 'DOWN']).describe('Overall status of the platform'),
            timestamp: z.string().datetime().describe('Timestamp when the check was executed'),
            services: z.object({
              mongodb: z.object({
                status: z.enum(['UP', 'DOWN']).describe('Status of the MongoDB connection'),
                error: z.string().optional().describe('Connection error details (if offline)'),
              }),
              redis: z.object({
                status: z.enum(['UP', 'DOWN']).describe('Status of the Redis connection'),
                error: z.string().optional().describe('Connection error details (if offline)'),
              }),
              firebase: z.object({
                status: z.enum(['UP', 'DOWN']).describe('Status of the Firebase Messaging connection'),
                error: z.string().optional().describe('Initialization error details (if offline)'),
              }),
            }),
          }),
        },
      },
    },
    503: {
      description: 'One or more essential services are degraded or down',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().describe('False if vital services are degraded or DOWN'),
            status: z.enum(['DOWN', 'DEGRADED']),
            timestamp: z.string().datetime(),
            services: z.any(),
          }),
        },
      },
    },
  },
});

// GET /api/v1/monitoring/metrics
registry.registerPath({
  method: 'get',
  path: '/monitoring/metrics',
  summary: 'Prometheus Metrics',
  description: 'Exposes application performance and traffic metrics formatted for Prometheus scrapers.',
  tags: [SWAGGER_TAGS.SYSTEM],
  responses: {
    200: {
      description: 'Plain-text Prometheus metrics output',
      content: {
        'text/plain': {
          schema: {
            type: 'string',
            example: '# HELP api_requests_total\n# TYPE api_requests_total counter\napi_requests_total 100',
          },
        },
      },
    },
  },
});
