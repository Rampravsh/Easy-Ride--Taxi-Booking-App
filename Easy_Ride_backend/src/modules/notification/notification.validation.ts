import { z } from 'zod';
import { RecipientType } from '../../shared/enums';

export const registerTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Device token is required'),
    type: z.nativeEnum(RecipientType).optional(),
  }),
});

export const removeTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Device token is required'),
    type: z.nativeEnum(RecipientType).optional(),
  }),
});

export const getHistorySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Notification ID'),
  }),
});
