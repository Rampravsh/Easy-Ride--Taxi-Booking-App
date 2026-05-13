import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    profileImage: z.string().url().optional(),
  }),
});

export const saveAddressSchema = z.object({
  body: z.object({
    label: z.string().min(1).max(30),
    address: z.string().min(5).max(200),
    coordinates: z.array(z.number()).length(2), // [longitude, latitude]
  }),
});

export const updateDeviceTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    notifications: z.object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).optional(),
    language: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }),
});

export const addEmergencyContactSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    relationship: z.string(),
  }),
});
