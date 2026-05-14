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

export enum NotificationType {
  RIDE_UPDATE = 'ride_update',
  PAYMENT_UPDATE = 'payment_update',
  REFUND_UPDATE = 'refund_update',
  CHAT_MESSAGE = 'chat_message',
  CALL_NOTIFICATION = 'call_notification',
  PROMO = 'promo',
  REMINDER = 'reminder',
  SYSTEM_ALERT = 'system_alert',
}

export enum DeliveryType {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read',
}

export enum RecipientType {
  USER = 'user',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  LOCATION = 'location',
  SYSTEM = 'system',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum CallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  MISSED = 'missed',
  ENDED = 'ended',
  FAILED = 'failed',
}

export enum PromoType {
  DISCOUNT = 'discount',
  CASHBACK = 'cashback',
  REFERRAL = 'referral',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

export enum ScheduleStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  SEARCHING = 'searching',
  ASSIGNED = 'assigned',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum PoolStatus {
  AVAILABLE = 'available',
  MATCHING = 'matching',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}