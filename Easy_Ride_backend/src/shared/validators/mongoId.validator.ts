import { z } from 'zod';

export const mongoIdSchema = z.string().length(24, 'Invalid MongoDB ID');
