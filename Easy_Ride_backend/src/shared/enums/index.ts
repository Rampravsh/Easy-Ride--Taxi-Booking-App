export enum UserRole {
  USER = 'user',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum RideStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  ARRIVED = 'arrived',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}


export enum VehicleType {
  BIKE = 'bike',
  CAR = 'car',
  AUTO = 'auto',
  LUXURY = 'luxury',
}