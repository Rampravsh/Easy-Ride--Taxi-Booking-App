import { registry } from '../swagger/registry';
import { SWAGGER_TAGS } from '../swagger/swagger.tags';
import { RESPONSE_SCHEMAS } from '../swagger/swagger.responses';
import { VehicleSchema } from '../swagger/swagger.schemas';
import { z } from 'zod';

/**
 * Vehicles API Documentation
 */

// POST /api/v1/vehicles
registry.registerPath({
  method: 'post',
  path: '/vehicles',
  summary: 'Register a New Vehicle (Riders Only)',
  description: 'Allows an onboarded driver (Rider role) to register a vehicle with their profile.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            type: z.enum(['bike', 'cab', 'auto']).describe('Type of vehicle'),
            category: z.enum(['saver', 'premium', 'luxury']).describe('Service tier class'),
            brand: z.string().min(2).describe('Vehicle manufacturer brand'),
            modelName: z.string().min(1).describe('Model brand name'),
            color: z.string().describe('Exterior paint color'),
            year: z.number().min(2000).describe('Manufacture year'),
            numberPlate: z.string().min(4).describe('Unique official license number plate'),
            seatingCapacity: z.number().min(1).describe('Seating passenger capacity'),
            fuelType: z.enum(['petrol', 'diesel', 'electric', 'cng']).describe('Fuel propulsion type'),
            vehicleImage: z.string().url().optional().describe('URL to uploaded image'),
          }),
        },
      },
    },
  },
  responses: {
    201: RESPONSE_SCHEMAS.SUCCESS(VehicleSchema, 'Vehicle registered successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or number plate already registered'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Riders only)'),
  },
});

// GET /api/v1/vehicles/my-vehicles
registry.registerPath({
  method: 'get',
  path: '/vehicles/my-vehicles',
  summary: 'List Rider Registered Vehicles (Riders Only)',
  description: 'Returns a list of all registered vehicles associated with the authenticated rider profile.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.array(VehicleSchema), 'Registered vehicles list retrieved'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Riders only)'),
  },
});

// GET /api/v1/vehicles/{vehicleId}
registry.registerPath({
  method: 'get',
  path: '/vehicles/{vehicleId}',
  summary: 'Get Vehicle Details',
  description: 'Retrieves complete profile details for a vehicle by its unique 24-character hexadecimal MongoDB Vehicle ID.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Vehicle ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(VehicleSchema, 'Vehicle details retrieved successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Vehicle ID format'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    404: RESPONSE_SCHEMAS.ERROR('Vehicle not found'),
  },
});

// PUT /api/v1/vehicles/{vehicleId}
registry.registerPath({
  method: 'put',
  path: '/vehicles/{vehicleId}',
  summary: 'Update Vehicle Details (Riders Only)',
  description: 'Updates partial configuration details of a vehicle profile owned by the authenticated rider.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Vehicle ID'),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            type: z.enum(['bike', 'cab', 'auto']).optional(),
            category: z.enum(['saver', 'premium', 'luxury']).optional(),
            brand: z.string().min(2).optional(),
            modelName: z.string().min(1).optional(),
            color: z.string().optional(),
            year: z.number().min(2000).optional(),
            numberPlate: z.string().min(4).optional(),
            seatingCapacity: z.number().min(1).optional(),
            fuelType: z.enum(['petrol', 'diesel', 'electric', 'cng']).optional(),
            vehicleImage: z.string().url().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(VehicleSchema, 'Vehicle updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or unauthorized access to update vehicle'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    404: RESPONSE_SCHEMAS.ERROR('Vehicle not found'),
  },
});

// DELETE /api/v1/vehicles/{vehicleId}
registry.registerPath({
  method: 'delete',
  path: '/vehicles/{vehicleId}',
  summary: 'Delete Registered Vehicle (Riders Only)',
  description: 'Permits an onboarded rider to delete a registered vehicle profile by its ID.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Vehicle ID'),
    }),
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(z.object({}), 'Vehicle deleted successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Invalid Vehicle ID format or unauthorized to delete'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    404: RESPONSE_SCHEMAS.ERROR('Vehicle not found'),
  },
});

// PUT /api/v1/vehicles/{vehicleId}/status
registry.registerPath({
  method: 'put',
  path: '/vehicles/{vehicleId}/status',
  summary: 'Toggle Vehicle Active Status (Riders Only)',
  description: 'Toggles vehicle online dispatch state. Only verified vehicles can be set to active online status.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Vehicle ID'),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            isActive: z.boolean().describe('True to set active online dispatch vehicle, false otherwise'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(VehicleSchema, 'Vehicle status updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed or vehicle not verified by admin yet'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    404: RESPONSE_SCHEMAS.ERROR('Vehicle not found'),
  },
});

// PUT /api/v1/vehicles/{vehicleId}/verify
registry.registerPath({
  method: 'put',
  path: '/vehicles/{vehicleId}/verify',
  summary: 'Approve or Reject Vehicle (Admin Only)',
  description: 'Administrative onboarding action to verify uploaded documents and approve/reject the vehicle.',
  tags: [SWAGGER_TAGS.VEHICLE],
  security: [{ firebaseAuth: [] }],
  request: {
    params: z.object({
      vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/).describe('24-character hexadecimal MongoDB Vehicle ID'),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['approved', 'rejected']).describe('Verification approval status decision'),
          }),
        },
      },
    },
  },
  responses: {
    200: RESPONSE_SCHEMAS.SUCCESS(VehicleSchema, 'Vehicle verification updated successfully'),
    400: RESPONSE_SCHEMAS.ERROR('Validation failed'),
    401: RESPONSE_SCHEMAS.ERROR('Unauthorized'),
    403: RESPONSE_SCHEMAS.ERROR('Forbidden (Admin only)'),
    404: RESPONSE_SCHEMAS.ERROR('Vehicle not found'),
  },
});
