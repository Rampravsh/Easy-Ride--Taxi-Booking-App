import { z } from 'zod';
import { VehicleType, PaymentMethod } from '../../shared/enums';
import { VehicleCategory } from '../vehicle/vehicle.interface';

const coordinatesSchema = z.array(z.number()).length(2); // [longitude, latitude]

export const estimateFareSchema = z.object({
  body: z.object({
    pickupCoordinates: coordinatesSchema,
    dropCoordinates: coordinatesSchema,
    rideType: z.nativeEnum(VehicleType),
    rideCategory: z.nativeEnum(VehicleCategory),
  }),
});

export const bookRideSchema = z.object({
  body: z.object({
    pickupCoordinates: coordinatesSchema,
    dropCoordinates: coordinatesSchema,
    pickupAddress: z.string().min(1),
    dropAddress: z.string().min(1),
    rideType: z.nativeEnum(VehicleType),
    rideCategory: z.nativeEnum(VehicleCategory),
    paymentMethod: z.nativeEnum(PaymentMethod),
  }),
});

export const acceptRideSchema = z.object({
  body: z.object({
    vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Vehicle ID'),
  }),
});

export const cancelRideSchema = z.object({
  body: z.object({
    reason: z.string().min(5),
  }),
});

export const rideIdParamSchema = z.object({
  params: z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
  }),
});
