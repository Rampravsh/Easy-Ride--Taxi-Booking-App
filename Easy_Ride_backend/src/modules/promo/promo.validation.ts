import { z } from 'zod';

export const validatePromoSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Promo code is required'),
    rideType: z.string().min(1, 'Ride type is required'),
    city: z.string().min(1, 'City is required'),
    fare: z.number().min(0, 'Fare must be positive'),
  }),
});
