import { z } from 'zod';

export const getRevenueSchema = z.object({
  query: z.object({
    startDate: z
      .string({ message: 'startDate is required' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'startDate must be a valid date string (e.g., ISO 8601 format)',
      }),
    endDate: z
      .string({ message: 'endDate is required' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'endDate must be a valid date string (e.g., ISO 8601 format)',
      }),
  }),
});

