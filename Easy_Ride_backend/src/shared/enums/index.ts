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

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  OPERATIONS_ADMIN = 'operations_admin',
  SUPPORT_ADMIN = 'support_admin',
  FINANCE_ADMIN = 'finance_admin',
  ANALYTICS_ADMIN = 'analytics_admin',
}

export enum FraudType {
  PROMO_ABUSE = 'promo_abuse',
  GPS_SPOOF = 'gps_spoof',
  WALLET_FRAUD = 'wallet_fraud',
  MULTI_ACCOUNT = 'multi_account',
  FAKE_RIDE = 'fake_ride',
}

export enum AuditAction {
  USER_UPDATE = 'user_update',
  RIDER_VERIFY = 'rider_verify',
  PAYMENT_REFUND = 'payment_refund',
  PROMO_CREATE = 'promo_create',
  SURGE_OVERRIDE = 'surge_override',
  ADMIN_LOGIN = 'admin_login',
}

export enum AuditStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}