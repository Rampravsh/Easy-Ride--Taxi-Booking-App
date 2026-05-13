import { z } from 'zod';
import { UserRole } from '../../shared/enums';

export const firebaseAuthSchema = z.object({
  body: z.object({
    token: z.string({
      message: 'Firebase ID token is required',
    }),
    role: z.nativeEnum(UserRole, {
      message: 'Role is required',
    }),
  }),
});

export type FirebaseAuthBody = z.infer<typeof firebaseAuthSchema>['body'];
