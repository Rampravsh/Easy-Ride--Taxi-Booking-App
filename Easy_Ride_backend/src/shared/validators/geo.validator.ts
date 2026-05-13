import { z } from 'zod';

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const geoJsonSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // Longitude
    z.number().min(-90).max(90),   // Latitude
  ]),
});
