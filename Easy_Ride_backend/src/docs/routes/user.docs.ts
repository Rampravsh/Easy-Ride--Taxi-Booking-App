import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { UserSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Passenger Profiles & Settings API Documentation
 */

// GET /api/v1/users/profile
registry.registerPath({
  method: 'get',
  path: '/users/profile',
  summary: 'Get Current Passenger Profile',
  description: 'Returns the complete detailed profile metadata of the currently authenticated passenger (requires FirebaseAuth token).',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Profile retrieved successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/users/profile
registry.registerPath({
  method: 'put',
  path: '/users/profile',
  summary: 'Update Passenger Profile Details',
  description: 'Updates full name, contact email, phone, and profile image path parameters in the database.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            fullName: z.string().min(2).max(50).optional().describe('Updated full name'),
            email: z.string().email().optional().describe('Updated contact email'),
            phone: z.string().min(10).max(15).optional().describe('Updated contact phone number'),
            profileImage: z.string().url().optional().describe('Updated profile picture URL path'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Profile updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or input constraints broken'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/users/profile-image
registry.registerPath({
  method: 'post',
  path: '/users/profile-image',
  summary: 'Upload Profile Avatar Image',
  description: 'Uploads a single profile avatar photo file via multipart/form-data. Returns the updated profile with the generated image URL.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            image: z.string().describe('Binary avatar photo file to upload'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Profile image uploaded successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Please upload a valid image file'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/users/address
registry.registerPath({
  method: 'post',
  path: '/users/address',
  summary: 'Add Saved Address Shortcut',
  description: 'Appends a frequently used address shortcut (Home, Work, Gym, etc.) with title description and geocoordinates arrays for fast booking auto-completes.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            label: z.string().min(1).max(30).describe('Address shortcut title (e.g. Work, Gym)'),
            address: z.string().min(5).max(200).describe('Full physical landmark address description'),
            coordinates: z.array(z.number()).length(2).describe('Geospatial coordinate arrays [longitude, latitude]'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Address saved successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or invalid geocoordinate elements'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// DELETE /api/v1/users/address/{id}
registry.registerPath({
  method: 'delete',
  path: '/users/address/{id}',
  summary: 'Delete Saved Address Shortcut',
  description: 'Removes a specific address shortcut entry from the passenger\'s list of saved locations by its MongoDB document subschema ID.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      id: z.string().describe('MongoDB Unique ID of the target saved address item'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Address deleted successfully'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    404: RESPONSE_SCHEMAS.ERROR('Address shortcut not found'),
  },
});

// PUT /api/v1/users/device-token
registry.registerPath({
  method: 'put',
  path: '/users/device-token',
  summary: 'Update Device FCM Push Token',
  description: 'Updates or binds a new Firebase Cloud Messaging push token for dispatching trip updates, chat messages, or call alerts to this device.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string().min(1).describe('Secure device FCM token string'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'Device token updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/users/preferences
registry.registerPath({
  method: 'get',
  path: '/users/preferences',
  summary: 'Get User Preference Settings',
  description: 'Retrieves current passenger preference profiles including notification toggles (SMS, Push, Email), preferred language, and interface theme selections.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        notifications: z.object({
          push: z.boolean(),
          email: z.boolean(),
          sms: z.boolean(),
        }),
        language: z.string(),
        theme: z.enum(['light', 'dark', 'system']),
      }),
      'User preferences retrieved successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/users/preferences
registry.registerPath({
  method: 'put',
  path: '/users/preferences',
  summary: 'Update User Preference Settings',
  description: 'Updates passenger notification channels, theme, or application language preference states.',
  tags: [SWAGGER_TAGS.USER],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            notifications: z.object({
              push: z.boolean().optional(),
              email: z.boolean().optional(),
              sms: z.boolean().optional(),
            }).optional(),
            language: z.string().optional(),
            theme: z.enum(['light', 'dark', 'system']).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(UserSchema, 'User preferences updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
