import { z } from 'zod';

export const reviewValidation = {
  createReview: {
    body: z.object({
      rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
      rating: z.number().min(1).max(5),
      comment: z.string().max(500).optional(),
    }),
  },
};
