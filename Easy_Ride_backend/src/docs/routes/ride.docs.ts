import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { RideSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Ride Operations & States API Documentation
 */

// POST /api/v1/rides/estimate
registry.registerPath({
  method: 'post',
  path: '/rides/estimate',
  summary: 'Calculate Ride Fare Estimate',
  description: 'Computes estimated distance, travel duration, surge multiplier, base fare, tax, and net total fare based on pickup/drop geocoordinates, vehicle class, and category tier.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            pickupCoordinates: z.array(z.number()).length(2).describe('Pickup [longitude, latitude] coordinates'),
            dropCoordinates: z.array(z.number()).length(2).describe('Drop [longitude, latitude] coordinates'),
            rideType: z.enum(['bike', 'auto', 'cab']).describe('Requested vehicle type'),
            rideCategory: z.enum(['saver', 'premium', 'luxury']).describe('Requested category/service class tier'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(
      z.object({
        estimatedDistance: z.number().describe('Calculated direct distance in meters'),
        estimatedDuration: z.number().describe('Estimated travel duration in seconds'),
        baseFare: z.number().describe('Base vehicle hiring fare'),
        surgeMultiplier: z.number().describe('Current demand-driven pricing surge multiplier'),
        taxAmount: z.number().describe('Total service tax/GST amount applied'),
        totalFare: z.number().describe('Net total pricing to be charged to the passenger'),
      }),
      'Fare estimates calculated successfully'
    ),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or invalid coordinates supplied'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// POST /api/v1/rides/book
registry.registerPath({
  method: 'post',
  path: '/rides/book',
  summary: 'Book a Ride Request',
  description: 'Submits a new real-time ride request in the SEARCHING state. Triggers geolocal queries to broadcast the request to nearby riders.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            pickupCoordinates: z.array(z.number()).length(2).describe('Pickup [longitude, latitude] array'),
            dropCoordinates: z.array(z.number()).length(2).describe('Drop [longitude, latitude] array'),
            pickupAddress: z.string().min(1).describe('Human readable pickup landmark address'),
            dropAddress: z.string().min(1).describe('Human readable destination landmark address'),
            rideType: z.enum(['bike', 'auto', 'cab']).describe('Type of vehicle to book'),
            rideCategory: z.enum(['saver', 'premium', 'luxury']).describe('Class of service to book'),
            paymentMethod: z.enum(['wallet', 'cash', 'card']).describe('Selected payment mode'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride booked successfully. Searching for nearby riders.'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed, or user already has an active ride'),
    404: RESPONSE_SCHEMAS.ERROR('No nearby riders available in booking radius'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// GET /api/v1/rides/{rideId}
registry.registerPath({
  method: 'get',
  path: '/rides/{rideId}',
  summary: 'Get Ride Details',
  description: 'Retrieves complete live details of a ride instance by its unique 24-character hexadecimal MongoDB Ride ID.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride details fetched successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Ride ID format'),
    404: RESPONSE_SCHEMAS.ERROR('Ride not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/rides/{rideId}/accept
registry.registerPath({
  method: 'put',
  path: '/rides/{rideId}/accept',
  summary: 'Accept Ride Offer (Rider Only)',
  description: 'Allows an active, available rider to accept an offered ride. Binds the rider\'s selected active vehicle instance to the ride record.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB ID of the rider\'s active verified vehicle'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride accepted successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Ride is no longer available or vehicle selection is invalid'),
    404: RESPONSE_SCHEMAS.ERROR('Ride not found'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized / Forbidden (Rider only)'),
  },
});

// PUT /api/v1/rides/{rideId}/arrived
registry.registerPath({
  method: 'put',
  path: '/rides/{rideId}/arrived',
  summary: 'Mark Arrived at Pickup (Rider Only)',
  description: 'Transitions the ride status to ARRIVING/arrived, indicating the driver has arrived at the passenger\'s pickup location. Triggers push/in-app alert updates to the user.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Marked as arrived at pickup location'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid state transition'),
    403: RESPONSE_SCHEMAS.ERROR('Unauthorized or not the assigned driver'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/rides/{rideId}/start
registry.registerPath({
  method: 'put',
  path: '/rides/{rideId}/start',
  summary: 'Start Ride with OTP Verification (Rider Only)',
  description: 'Starts the trip transit. Verifies the OTP provided by the passenger to authorize the start of tracking.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            otp: z.string().min(4).describe('4 or 6 digit secure starting OTP provided by passenger'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride started successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid OTP code or invalid status transition'),
    403: RESPONSE_SCHEMAS.ERROR('Unauthorized or not the assigned driver'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/rides/{rideId}/complete
registry.registerPath({
  method: 'put',
  path: '/rides/{rideId}/complete',
  summary: 'Complete a Ride (Rider Only)',
  description: 'Finishes the trip transit. Automatically transitions ride status to completed, makes the rider available again, evaluates payment status (credits wallet if wallet payment selected), triggers invoices, and starts async fraud audits.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride completed successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid state transition'),
    403: RESPONSE_SCHEMAS.ERROR('Unauthorized or not the assigned driver'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});

// PUT /api/v1/rides/{rideId}/cancel
registry.registerPath({
  method: 'put',
  path: '/rides/{rideId}/cancel',
  summary: 'Cancel a Ride',
  description: 'Cancels the ride if it hasn\'t started yet. Requires a cancellation reason. Recalculates driver availability and fires alerts.',
  tags: [SWAGGER_TAGS.RIDE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Ride ID'),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            reason: z.string().min(5).describe('Reason for cancellation (min 5 characters)'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(RideSchema, 'Ride cancelled successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Ride cannot be cancelled in its current state'),
    403: RESPONSE_SCHEMAS.ERROR('Unauthorized to cancel this ride'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
  },
});
