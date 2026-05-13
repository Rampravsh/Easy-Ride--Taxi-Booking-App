import { z } from 'zod';

export const updateRiderProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    profileImage: z.string().url().optional(),
  }),
});

export const updateLocationSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    isOnline: z.boolean(),
  }),
});

export const updateAvailabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean(),
  }),
});

export const updateDeviceTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

export const uploadDocumentSchema = z.object({
  body: z.object({
    type: z.enum(['drivingLicense', 'insurance', 'rcBook', 'aadhaar', 'profilePhoto']),
    url: z.string().url(),
  }),
});
