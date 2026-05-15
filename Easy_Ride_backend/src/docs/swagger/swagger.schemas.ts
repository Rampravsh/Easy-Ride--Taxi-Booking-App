import { z } from 'zod';
import { registry } from './registry';

/**
 * Base User Schema
 */
export const UserSchema = registry.register(
  'User',
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    role: z.enum(['USER', 'RIDER', 'ADMIN']),
    isVerified: z.boolean(),
    profileImage: z.string().url().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Ride Schema
 */
export const RideSchema = registry.register(
  'Ride',
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    riderId: z.string().uuid().nullable(),
    pickupLocation: z.object({
      address: z.string(),
      coordinates: z.array(z.number()).length(2),
    }),
    dropLocation: z.object({
      address: z.string(),
      coordinates: z.array(z.number()).length(2),
    }),
    status: z.enum(['PENDING', 'ACCEPTED', 'ARRIVED', 'STARTED', 'COMPLETED', 'CANCELLED']),
    fare: z.number(),
    distance: z.number(),
    duration: z.number(),
    vehicleType: z.string(),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']),
    createdAt: z.string().datetime(),
  })
);

/**
 * Wallet Schema
 */
export const WalletSchema = registry.register(
  'Wallet',
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    balance: z.number(),
    currency: z.string().default('INR'),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Transaction Schema
 */
export const TransactionSchema = registry.register(
  'Transaction',
  z.object({
    id: z.string().uuid(),
    walletId: z.string().uuid(),
    amount: z.number(),
    type: z.enum(['CREDIT', 'DEBIT']),
    status: z.enum(['PENDING', 'SUCCESS', 'FAILED']),
    referenceId: z.string(),
    description: z.string(),
    createdAt: z.string().datetime(),
  })
);
