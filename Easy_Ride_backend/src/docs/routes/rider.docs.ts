import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { RiderSchema, RideSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Riders Operations & Profiles API Documentation
 */

// GET /api/v1/riders/profile
registry.registerPath({
  method: 'get',
  path: '/riders/profile',
  summary: 'Get Current Rider Profile',
  description: 'Retrieves complete profile details for the authenticated rider (requires FirebaseAuth & RIDER role).',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RiderSchema, 'Rider profile retrieved successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
    404: RESPONSE_SCHEMAS.ERROR('Rider not found'),
  },
});

// PUT /api/v1/riders/profile
registry.registerPath({
  method: 'put',
  path: '/riders/profile',
  summary: 'Update Rider Profile Details',
  description: 'Updates full name, contact email, phone number, and avatar image parameters of the authenticated rider profile.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            fullName: z.string().min(2).max(50).optional().describe('Updated full legal name'),
            email: z.string().email().optional().describe('Updated email address'),
            phone: z.string().min(10).max(15).optional().describe('Updated contact phone number'),
            profileImage: z.string().url().optional().describe('Updated profile avatar URL'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RiderSchema, 'Rider profile updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});

// PUT /api/v1/riders/status
registry.registerPath({
  method: 'put',
  path: '/riders/status',
  summary: 'Update Rider Online Status Toggle',
  description: 'Sets the online active flag (isOnline) for dispatch matching systems.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            isOnline: z.boolean().describe('True to set driver online, false to set offline'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RiderSchema, 'Rider online status updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});

// PUT /api/v1/riders/location
registry.registerPath({
  method: 'put',
  path: '/riders/location',
  summary: 'Update Rider Live GPS Location coordinates',
  description: 'Frequently pinged by client application background location trackers to update the driver\'s live GPS coordinates in the database (2dsphere index).',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            latitude: z.number().min(-90).max(90).describe('Current GPS latitude (-90 to 90)'),
            longitude: z.number().min(-180).max(180).describe('Current GPS longitude (-180 to 180)'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RiderSchema, 'Rider live location coordinates updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or invalid coordinates range'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});

// PUT /api/v1/riders/availability
registry.registerPath({
  method: 'put',
  path: '/riders/availability',
  summary: 'Update Rider Dispatch Availability',
  description: 'Toggles isAvailable flag to signal to booking engine whether driver is ready to accept new incoming offers.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            isAvailable: z.boolean().describe('True if driver is free to accept dispatch offers'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RiderSchema, 'Rider availability updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});

// PUT /api/v1/riders/device-token
registry.registerPath({
  method: 'put',
  path: '/riders/device-token',
  summary: 'Register FCM Push Token',
  description: 'Registers or updates a secure device FCM push notification token associated with the driver\'s active login session.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string().min(1).describe('FCM secure device push token string'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RiderSchema, 'Device token updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});

// GET /api/v1/riders/earnings
registry.registerPath({
  method: 'get',
  path: '/riders/earnings',
  summary: 'Get Rider Earnings Info',
  description: 'Retrieves life-time total driver payout earnings, active balance, and completed trips numbers.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        totalEarnings: z.number().describe('Driver life-time net earnings in INR'),
        totalTrips: z.number().describe('Driver total completed trips'),
        walletBalance: z.number().describe('Driver current withdrawable wallet balance'),
      }),
      'Rider earnings retrieved successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});

// GET /api/v1/riders/current-ride
registry.registerPath({
  method: 'get',
  path: '/riders/current-ride',
  summary: 'Get Current Active Assigned Trip details',
  description: 'Returns detailed information about the driver\'s current active trip in progress (accepted, arrived, started), or null if the driver is currently idle.',
  tags: [SWAGGER_TAGS.RIDER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        currentRide: RideSchema.nullable().describe('Detailed current active assigned ride object or null'),
      }),
      'Current ride status retrieved'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Rider only)'),
  },
});
