/**
 * payment.constants.ts
 *
 * SYNC NOTE: REFUND_STATUS was removed — it duplicated TransactionStatus from shared/enums.
 * All payment-related status values must use TransactionStatus.
 *
 * PAYMENT_GATEWAY has been replaced by the PaymentGateway enum in shared/enums.
 * Re-exported here for backward compatibility.
 */

import { PaymentGateway } from '../../shared/enums';

export { PaymentGateway };

/**
 * @deprecated Use PaymentGateway enum from shared/enums instead.
 */
export const PAYMENT_GATEWAY = {
  RAZORPAY: PaymentGateway.RAZORPAY,
  STRIPE: 'stripe', // for future expansion — add to PaymentGateway enum when ready
} as const;

export const CURRENCY = {
  INR: 'INR',
  USD: 'USD',
} as const;

// REFUND_STATUS intentionally removed — use TransactionStatus from shared/enums:
// TransactionStatus.PENDING, TransactionStatus.SUCCESS, TransactionStatus.REFUNDED
