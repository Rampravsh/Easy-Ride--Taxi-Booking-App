import { z } from 'zod';

export const createScheduleSchema = z.object({
  body: z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
    scheduledAt: z.string().datetime(),
    autoAssigned: z.boolean().optional(),
  }),
});
