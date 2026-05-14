import { z } from 'zod';

export const locationPayloadSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  heading: z.number().optional(),
  speed: z.number().optional(),
});

export const validateLocation = (data: any) => {
  return locationPayloadSchema.safeParse(data);
};
