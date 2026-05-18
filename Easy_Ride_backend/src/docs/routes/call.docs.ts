import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { CallSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Calls API Documentation
 */

// POST /api/v1/calls/initiate
registry.registerPath({
  method: 'post',
  path: '/calls/initiate',
  summary: 'Initiate a Call',
  description: 'Initiates an audio or video call between a user and a rider for an active ride. Creates a Twilio Room and returns a generated Twilio access token for the caller. Sends a real-time CALL_INCOMING socket event to the receiver.',
  tags: [SWAGGER_TAGS.CALL],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
            callType: z.enum(['audio', 'video']).describe('Type of call'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        call: CallSchema,
        token: z.string().describe('Twilio RTC access token generated for the caller'),
      }),
      'Call initiated successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Receiver not found or invalid input parameter formats'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - you are not a participant of this ride'),
    404: RESPONSE_SCHEMAS.ERROR('Ride not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/calls/{callId}/accept
registry.registerPath({
  method: 'post',
  path: '/calls/{callId}/accept',
  summary: 'Accept an Incoming Call',
  description: 'Accepts an incoming call. Marks status as accepted, generates a Twilio access token for the receiver, and notifies the caller via socket.',
  tags: [SWAGGER_TAGS.CALL],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      callId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal Call ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        token: z.string().describe('Twilio RTC access token generated for the receiver'),
      }),
      'Call accepted successfully'
    ),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - you are not the receiver of this call'),
    404: RESPONSE_SCHEMAS.ERROR('Call not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/calls/{callId}/reject
registry.registerPath({
  method: 'post',
  path: '/calls/{callId}/reject',
  summary: 'Reject an Incoming Call',
  description: 'Rejects an incoming call, changes status to rejected, and notifies the caller via socket.',
  tags: [SWAGGER_TAGS.CALL],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      callId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal Call ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({}),
      'Call rejected successfully'
    ),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden - you are not authorized to reject this call'),
    404: RESPONSE_SCHEMAS.ERROR('Call not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/calls/{callId}/end
registry.registerPath({
  method: 'post',
  path: '/calls/{callId}/end',
  summary: 'End an Active Call',
  description: 'Ends an ongoing call. Sets ended timestamp, calculates duration in seconds, closes the Twilio room, and emits CALL_ENDED sockets to both participants.',
  tags: [SWAGGER_TAGS.CALL],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      callId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal Call ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({}),
      'Call ended successfully'
    ),
    404: RESPONSE_SCHEMAS.ERROR('Call not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/calls/history
registry.registerPath({
  method: 'get',
  path: '/calls/history',
  summary: 'Get Call History',
  description: 'Retrieves a paginated list of calls where the authenticated user was either the caller or the receiver. Populates basic details of the associated ride.',
  tags: [SWAGGER_TAGS.CALL],
  security: [{ firebaseAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().describe('Page number (defaults to 1)'),
      limit: z.string().optional().describe('Number of records per page (defaults to 20)'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.array(
        CallSchema.extend({
          ride: z.object({
            _id: z.string().describe('MongoDB Ride ID'),
            pickupLocation: z.any().describe('Pickup location coordinates/details'),
            destinationLocation: z.any().describe('Destination location coordinates/details'),
          }).describe('Populated Ride details'),
        })
      ),
      'Call history fetched successfully'
    ),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
