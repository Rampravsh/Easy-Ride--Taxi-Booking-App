import { z } from 'zod';

export const joinPoolSchema = z.object({
  body: z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
    pickup: z.object({
      coordinates: z.array(z.number()).length(2),
      address: z.string(),
    }),
    drop: z.object({
      coordinates: z.array(z.number()).length(2),
      address: z.string(),
    }),
    seats: z.number().min(1).max(4),
    fare: z.number().min(0),
  }),
});
