import { z } from 'zod';
import { CallType } from '../../shared/enums';

export const initiateCallSchema = z.object({
  body: z.object({
    rideId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Ride ID'),
    callType: z.nativeEnum(CallType),
  }),
});

export const callIdParamSchema = z.object({
  params: z.object({
    callId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Call ID'),
  }),
});
