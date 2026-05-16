// =============================================================================
// EASY RIDE — CENTRALIZED ENUM DEFINITIONS
// Single authoritative source for ALL enums across all modules.
// DO NOT define domain enums locally in module files — import from here.
// =============================================================================

// ---------------------------------------------------------------------------
// USER & AUTH
// ---------------------------------------------------------------------------

export enum UserRole {
  USER = 'user',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  OPERATIONS_ADMIN = 'operations_admin',
  SUPPORT_ADMIN = 'support_admin',
  FINANCE_ADMIN = 'finance_admin',
  ANALYTICS_ADMIN = 'analytics_admin',
}

/**
 * All roles that are considered admin-level (for broad RBAC checks).
 * Use AdminRole enum for fine-grained access.
 */
export const ALL_ADMIN_ROLES: AdminRole[] = Object.values(AdminRole);

export enum AuthProvider {
  FIREBASE = 'firebase',
  GOOGLE = 'google',
  PHONE = 'phone',
  EMAIL = 'email',
}

// ---------------------------------------------------------------------------
// RIDE LIFECYCLE
// ---------------------------------------------------------------------------

export enum RideStatus {
  SEARCHING = 'searching',
  ACCEPTED = 'accepted',
  ARRIVING = 'arriving',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ---------------------------------------------------------------------------
// PAYMENT & WALLET
// ---------------------------------------------------------------------------

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

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
  MANUAL = 'manual',
  SYSTEM = 'system',
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
  POOL_PAYMENT = 'pool_payment',
  SCHEDULED_RIDE_PAYMENT = 'scheduled_ride_payment',
  PROMO_CASHBACK = 'promo_cashback',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// ---------------------------------------------------------------------------
// VEHICLE
// ---------------------------------------------------------------------------

export enum VehicleType {
  BIKE = 'bike',
  CAR = 'car',
  AUTO = 'auto',
  LUXURY = 'luxury',
}

// ---------------------------------------------------------------------------
// RIDER VERIFICATION
// (was previously defined locally in rider.interface.ts — now centralized)
// ---------------------------------------------------------------------------

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------

export enum NotificationType {
  RIDE_UPDATE = 'ride_update',
  PAYMENT_UPDATE = 'payment_update',
  REFUND_UPDATE = 'refund_update',
  CHAT_MESSAGE = 'chat_message',
  CALL_NOTIFICATION = 'call_notification',
  PROMO = 'promo',
  REMINDER = 'reminder',
  SYSTEM_ALERT = 'system_alert',
  FRAUD_ALERT = 'fraud_alert',
  SCHEDULE_REMINDER = 'schedule_reminder',
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

// ---------------------------------------------------------------------------
// CHAT & CALLS
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// PROMO
// ---------------------------------------------------------------------------

export enum PromoType {
  DISCOUNT = 'discount',
  CASHBACK = 'cashback',
  REFERRAL = 'referral',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

export enum PromoStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  EXHAUSTED = 'exhausted',
}

// ---------------------------------------------------------------------------
// SCHEDULING
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// POOLING
// ---------------------------------------------------------------------------

export enum PoolStatus {
  AVAILABLE = 'available',
  MATCHING = 'matching',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ---------------------------------------------------------------------------
// FRAUD DETECTION
// ---------------------------------------------------------------------------

export enum FraudType {
  PROMO_ABUSE = 'promo_abuse',
  GPS_SPOOF = 'gps_spoof',
  WALLET_FRAUD = 'wallet_fraud',
  MULTI_ACCOUNT = 'multi_account',
  FAKE_RIDE = 'fake_ride',
}

export enum FraudSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ---------------------------------------------------------------------------
// AUDIT LOGGING
// ---------------------------------------------------------------------------

export enum AuditAction {
  // User actions
  USER_UPDATE = 'user_update',
  USER_BLOCK = 'user_block',
  USER_UNBLOCK = 'user_unblock',

  // Rider actions
  RIDER_VERIFY = 'rider_verify',
  RIDER_BLOCK = 'rider_block',
  RIDER_REJECT = 'rider_reject',

  // Ride actions
  RIDE_CANCEL = 'ride_cancel',
  RIDE_COMPLETE = 'ride_complete',

  // Payment & Wallet
  PAYMENT_REFUND = 'payment_refund',
  REFUND_PROCESS = 'refund_process',
  WALLET_LOCK = 'wallet_lock',
  WALLET_UNLOCK = 'wallet_unlock',

  // Promo actions
  PROMO_CREATE = 'promo_create',
  PROMO_UPDATE = 'promo_update',
  PROMO_DELETE = 'promo_delete',

  // Admin actions
  ADMIN_LOGIN = 'admin_login',
  ADMIN_LOGOUT = 'admin_logout',
  CONFIG_CHANGE = 'config_change',
  SURGE_OVERRIDE = 'surge_override',

  // Fraud actions
  FRAUD_FLAG = 'fraud_flag',

  // Schedule & Pool
  SCHEDULE_CANCEL = 'schedule_cancel',
  POOL_CANCEL = 'pool_cancel',
}

export enum AuditStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

// ---------------------------------------------------------------------------
// REVIEW
// ---------------------------------------------------------------------------

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}