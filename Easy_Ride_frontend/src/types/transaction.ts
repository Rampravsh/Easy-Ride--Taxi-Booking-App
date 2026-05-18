export type TransactionType = 'credit' | 'debit' | 'refund';

export type TransactionCategory =
  | 'ride_payment'
  | 'wallet_topup'
  | 'cashback'
  | 'reward'
  | 'cancellation_refund'
  | 'rider_payout'
  | 'pool_payment'
  | 'scheduled_ride_payment'
  | 'promo_cashback';

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'refunded';

export type PaymentGateway = 'razorpay' | 'manual' | 'system' | 'stripe';

export interface Transaction {
  _id: string;
  user: string;
  rider?: string;
  wallet?: string;
  ride?: string;
  paymentGateway?: PaymentGateway;
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
  amount: number;
  currency: string;
  status: TransactionStatus;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  metadata?: Record<string, any>;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
