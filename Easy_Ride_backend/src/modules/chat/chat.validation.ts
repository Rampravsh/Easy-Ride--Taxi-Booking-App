import { z } from 'zod';
import { MessageType } from '../../shared/enums';

export const sendMessageSchema = z.object({
  body: z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
    content: z.string().min(1, 'Content is required'),
    messageType: z.nativeEnum(MessageType).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});


export const getMessagesSchema = z.object({
  params: z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
  }),
  query: z.object({
    limit: z.string().optional(),
    lastCreatedAt: z.string().optional(),
  }),
});
