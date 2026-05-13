import { z } from 'zod';
import { VehicleType, VehicleCategory, FuelType } from './vehicle.interface';

export const createVehicleSchema = z.object({
  body: z.object({
    type: z.nativeEnum(VehicleType),
    category: z.nativeEnum(VehicleCategory),
    brand: z.string().min(2),
    modelName: z.string().min(1),
    color: z.string(),
    year: z.number().min(2000).max(new Date().getFullYear() + 1),
    numberPlate: z.string().min(4).max(15),
    seatingCapacity: z.number().min(1).max(10),
    fuelType: z.nativeEnum(FuelType),
    vehicleImage: z.string().url().optional(),
  }),
});

export const updateVehicleSchema = z.object({
  body: createVehicleSchema.shape.body.partial(),
});

export const updateVehicleStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const verifyVehicleSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected']),
  }),
});

export const uploadVehicleDocumentSchema = z.object({
  body: z.object({
    type: z.enum(['rcBook', 'insurance', 'pollution', 'permit', 'fitnessCertificate']),
    url: z.string().url(),
  }),
});
