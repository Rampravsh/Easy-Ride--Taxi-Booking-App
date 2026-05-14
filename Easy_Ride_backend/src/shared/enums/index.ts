export enum UserRole {
  USER = 'user',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum RideStatus {
  SEARCHING = 'searching',
  ACCEPTED = 'accepted',
  ARRIVING = 'arriving',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  WALLET = 'wallet',
  ONLINE = 'online',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  REFUND = 'refund',
}

export enum TransactionCategory {
  RIDE_PAYMENT = 'ride_payment',
  WALLET_TOPUP = 'wallet_topup',
  CASHBACK = 'cashback',
  REWARD = 'reward',
  CANCELLATION_REFUND = 'cancellation_refund',
  RIDER_PAYOUT = 'rider_payout',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}


export enum VehicleType {
  BIKE = 'bike',
  CAR = 'car',
  AUTO = 'auto',
  LUXURY = 'luxury',
}