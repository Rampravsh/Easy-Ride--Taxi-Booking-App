import { z } from 'zod';
import { registry } from './registry';

/**
 * Base User Schema
 */
export const UserSchema = registry.register(
  'User',
  z.object({
    _id: z.string().describe('MongoDB Unique Identifier'),
    firebaseUID: z.string().describe('Firebase Unique Identifier'),
    fullName: z.string().describe('Full name of the user'),
    email: z.string().email().nullable().optional().describe('Email address'),
    phone: z.string().nullable().optional().describe('Phone number'),
    role: z.enum(['user', 'rider', 'admin']).describe('User role'),
    profileImage: z.string().nullable().optional().describe('Profile image URL'),
    walletBalance: z.number().default(0).describe('Current wallet balance'),
    rating: z.number().default(5.0).describe('Average user rating'),
    totalRides: z.number().default(0).describe('Total rides completed'),
    savedAddresses: z.array(
      z.object({
        _id: z.string().optional(),
        label: z.string(),
        address: z.string(),
        location: z.object({
          type: z.string().default('Point'),
          coordinates: z.array(z.number()).length(2),
        }).optional(),
      })
    ).optional(),
    deviceTokens: z.array(z.string()).optional(),
    isBlocked: z.boolean().default(false).describe('Whether the user account is blocked'),
    preferences: z.object({
      notifications: z.object({
        push: z.boolean().default(true),
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
      }),
      language: z.string().default('en'),
      theme: z.enum(['light', 'dark', 'system']).default('system'),
    }).optional(),
    emergencyContacts: z.array(
      z.object({
        _id: z.string().optional(),
        name: z.string(),
        phone: z.string(),
        relationship: z.string(),
      })
    ).optional(),
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
    _id: z.string().describe('MongoDB Ride Identifier'),
    user: z.string().describe('Associated User ID (Passenger)'),
    rider: z.string().nullable().optional().describe('Associated Rider ID (Driver)'),
    vehicle: z.string().nullable().optional().describe('Associated Vehicle ID'),
    rideType: z.enum(['bike', 'auto', 'cab']).describe('Requested vehicle type'),
    rideCategory: z.enum(['saver', 'premium', 'luxury']).describe('Requested category class'),
    status: z.enum(['searching', 'accepted', 'arrived', 'started', 'completed', 'cancelled']).describe('Operational ride state'),
    pickupLocation: z.object({
      type: z.string().default('Point'),
      coordinates: z.array(z.number()).length(2).describe('Coordinates [lng, lat]'),
      address: z.string().describe('Pickup location human-readable address'),
    }),
    dropLocation: z.object({
      type: z.string().default('Point'),
      coordinates: z.array(z.number()).length(2).describe('Coordinates [lng, lat]'),
      address: z.string().describe('Drop location human-readable address'),
    }),
    routePath: z.string().optional().describe('Encoded route polyline string'),
    estimatedDistance: z.number().describe('Calculated distance in km or meters'),
    estimatedDuration: z.number().describe('Calculated travel duration in seconds/minutes'),
    actualDistance: z.number().optional().describe('Actual driven distance in km or meters'),
    actualDuration: z.number().optional().describe('Actual driven travel duration in seconds/minutes'),
    baseFare: z.number().describe('Core base price for the trip'),
    surgeMultiplier: z.number().default(1.0).describe('Pricing demand surge multiplier'),
    taxAmount: z.number().describe('Calculated tax amount applied'),
    totalFare: z.number().describe('Net fare amount to pay'),
    paymentMethod: z.enum(['wallet', 'cash', 'card']).describe('Preferred payment mode'),
    paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']).describe('Current state of invoice payment'),
    otp: z.string().describe('4 or 6 digit ride start OTP pin code'),
    startedAt: z.string().datetime().nullable().optional(),
    completedAt: z.string().datetime().nullable().optional(),
    cancelledAt: z.string().datetime().nullable().optional(),
    cancelledBy: z.string().nullable().optional().describe('ID of profile that initiated cancellation'),
    cancelledByModel: z.enum(['User', 'Rider', 'Admin']).nullable().optional(),
    cancellationReason: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Wallet Schema
 */
export const WalletSchema = registry.register(
  'Wallet',
  z.object({
    _id: z.string().describe('MongoDB Wallet Identifier'),
    user: z.string().describe('Owner User ID'),
    balance: z.number().describe('Available credit/wallet balance in currency unit'),
    currency: z.string().default('INR').describe('Wallet local currency unit'),
    isBlocked: z.boolean().default(false).describe('Blocked status flag'),
    lastTransaction: z.string().optional().describe('Reference ID to last transaction log'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);


/**
 * Transaction Schema
 */
export const TransactionSchema = registry.register(
  'Transaction',
  z.object({
    _id: z.string().describe('MongoDB Transaction Identifier'),
    user: z.string().describe('Associated User ID'),
    rider: z.string().optional().describe('Associated Rider ID (if applicable)'),
    wallet: z.string().optional().describe('Associated Wallet ID'),
    ride: z.string().optional().describe('Associated Ride ID (if applicable)'),
    paymentGateway: z.enum(['razorpay', 'manual', 'system']).default('system').describe('Payment gateway used'),
    transactionType: z.enum(['credit', 'debit', 'refund', 'hold', 'release']).describe('Type of transaction'),
    transactionCategory: z.enum([
      'wallet_topup',
      'ride_payment',
      'payout',
      'cancellation_refund',
      'cancellation_fee',
      'incentive',
      'referral',
      'adjustment',
    ]).describe('Category of transaction'),
    amount: z.number().describe('Transaction amount'),
    currency: z.string().default('INR').describe('Transaction currency'),
    status: z.enum(['pending', 'success', 'failed', 'refunded']).default('pending').describe('Current status of the transaction'),
    gatewayOrderId: z.string().optional().describe('External gateway Order ID'),
    gatewayPaymentId: z.string().optional().describe('External gateway Payment ID'),
    gatewaySignature: z.string().optional().describe('External gateway Signature'),
    metadata: z.any().optional().describe('Additional JSON metadata'),
    description: z.string().optional().describe('Description notes for the transaction'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);



/**
 * Audit Log Schema
 */
export const AuditSchema = registry.register(
  'Audit',
  z.object({
    id: z.string(),
    admin: z.union([
      z.string(),
      z.object({
        fullName: z.string(),
        email: z.string().email(),
      })
    ]),
    action: z.string(),
    resource: z.string(),
    resourceId: z.string().optional(),
    previousState: z.any().optional(),
    newState: z.any().optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    status: z.enum(['SUCCESS', 'FAILED']),
    metadata: z.any().optional(),
    createdAt: z.string().datetime(),
  })
);

/**
 * Call Schema
 */
export const CallSchema = registry.register(
  'Call',
  z.object({
    _id: z.string().describe('MongoDB Call Identifier'),
    ride: z.string().describe('Associated Ride ID'),
    caller: z.string().describe('Caller User ID'),
    receiver: z.string().describe('Receiver User ID'),
    callType: z.enum(['audio', 'video']).describe('Type of call'),
    status: z.enum(['initiated', 'ringing', 'accepted', 'rejected', 'missed', 'ended', 'failed']).describe('Status of the call'),
    startedAt: z.string().datetime().nullable().optional().describe('Call start timestamp'),
    endedAt: z.string().datetime().nullable().optional().describe('Call end timestamp'),
    duration: z.number().default(0).describe('Call duration in seconds'),
    twilioRoomId: z.string().optional().describe('Twilio Video Room Name'),
    twilioSid: z.string().optional().describe('Twilio Video Room SID'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Chat Message Schema
 */
export const MessageSchema = registry.register(
  'Message',
  z.object({
    _id: z.string().describe('MongoDB Message Identifier'),
    ride: z.string().describe('Associated Ride ID'),
    sender: z.string().describe('Sender User ID'),
    receiver: z.string().describe('Receiver User ID'),
    messageType: z.enum(['text', 'image', 'audio', 'location', 'system']).describe('Type of chat message'),
    content: z.string().describe('Text content of the message or file URL'),
    status: z.enum(['sent', 'delivered', 'read', 'failed']).describe('Delivery status'),
    metadata: z.any().optional().describe('Additional payload (e.g. image dimensions, location coordinates)'),
    deliveredAt: z.string().datetime().nullable().optional().describe('Timestamp when the message was delivered'),
    readAt: z.string().datetime().nullable().optional().describe('Timestamp when the message was read'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Notification Schema
 */
export const NotificationSchema = registry.register(
  'Notification',
  z.object({
    _id: z.string().describe('MongoDB Notification Identifier'),
    recipient: z.string().describe('Recipient User/Rider ID'),
    recipientType: z.enum(['user', 'rider', 'admin']).describe('Type of recipient'),
    title: z.string().describe('Notification title'),
    body: z.string().describe('Notification body text'),
    notificationType: z.enum([
      'ride_update',
      'payment_update',
      'refund_update',
      'chat_message',
      'call_notification',
      'promo',
      'reminder',
      'system_alert',
      'fraud_alert',
      'schedule_reminder',
    ]).describe('Type category of the notification'),
    deliveryType: z.array(z.enum(['push', 'email', 'sms', 'in_app'])).describe('Enabled delivery channels'),
    status: z.enum(['pending', 'queued', 'sent', 'delivered', 'failed', 'read']).describe('Current delivery status'),
    metadata: z.any().optional().describe('Payload metadata related to the notification'),
    isRead: z.boolean().default(false).describe('Whether user has read this notification'),
    sentAt: z.string().datetime().nullable().optional().describe('Timestamp when the notification was sent'),
    readAt: z.string().datetime().nullable().optional().describe('Timestamp when the notification was read'),
    failedReason: z.string().optional().describe('Reason for failure (if failed)'),
    retryCount: z.number().default(0).describe('Number of delivery retries attempted'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Pool Schema
 */
export const PoolSchema = registry.register(
  'Pool',
  z.object({
    _id: z.string().describe('MongoDB Pool Identifier'),
    mainRide: z.string().describe('Associated Main Ride ID'),
    rider: z.string().optional().describe('Associated Rider ID'),
    passengers: z.array(
      z.object({
        user: z.string().describe('Passenger User ID'),
        ride: z.string().describe('Passenger Ride ID'),
        seats: z.number().default(1).describe('Number of seats booked by passenger'),
        pickupLocation: z.object({
          type: z.string().default('Point'),
          coordinates: z.array(z.number()).length(2),
          address: z.string(),
        }).describe('Passenger pickup location'),
        dropLocation: z.object({
          type: z.string().default('Point'),
          coordinates: z.array(z.number()).length(2),
          address: z.string(),
        }).describe('Passenger drop location'),
        fare: z.number().describe('Passenger fare'),
        joinedAt: z.string().datetime(),
      })
    ).describe('List of passengers joined in the pool'),
    availableSeats: z.number().describe('Number of currently available seats'),
    maxSeats: z.number().default(4).describe('Maximum passenger seats in this vehicle'),
    route: z.object({
      polyline: z.string().optional(),
      waypoints: z.array(z.any()).optional(),
    }).optional().describe('Calculated pool route path'),
    status: z.enum(['available', 'full', 'started', 'completed', 'cancelled']).default('available').describe('Status of the pool'),
    timestamps: z.object({
      startedAt: z.string().datetime().nullable().optional(),
      endedAt: z.string().datetime().nullable().optional(),
    }).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Promo Schema
 */
export const PromoSchema = registry.register(
  'Promo',
  z.object({
    _id: z.string().describe('MongoDB Promo Identifier'),
    code: z.string().describe('Promo code string (uppercase)'),
    promoType: z.enum(['discount', 'referral']).default('discount').describe('Type of promo code'),
    discountType: z.enum(['flat', 'percentage']).describe('Discount evaluation type'),
    discountValue: z.number().describe('Amount or percentage rate of discount'),
    maxDiscount: z.number().optional().describe('Maximum allowed discount cap in INR'),
    minimumFare: z.number().default(0).describe('Minimum fare requirement to apply this promo'),
    usageLimit: z.number().describe('Maximum usage count limit for this promo code'),
    usageCount: z.number().default(0).describe('Current number of times used'),
    perUserLimit: z.number().default(1).describe('Maximum times a single user can apply this code'),
    validFrom: z.string().datetime().describe('Valid start timestamp'),
    validUntil: z.string().datetime().describe('Valid expiry timestamp'),
    applicableRideTypes: z.array(z.string()).describe('Applicable ride/vehicle types'),
    applicableCities: z.array(z.string()).describe('Applicable operating cities'),
    isActive: z.boolean().default(true).describe('Active status flag'),
    promoStatus: z.enum(['active', 'expired', 'depleted']).default('active').describe('Operational status of the promo code'),
    metadata: z.any().optional().describe('Additional payload JSON metadata'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Review Schema
 */
export const ReviewSchema = registry.register(
  'Review',
  z.object({
    _id: z.string().describe('MongoDB Review Identifier'),
    rideId: z.string().describe('Associated Ride ID'),
    reviewerId: z.string().describe('Reviewer User ID'),
    receiverId: z.string().describe('Receiver User/Rider ID'),
    rating: z.number().min(1).max(5).describe('Star rating value (1 to 5)'),
    comment: z.string().optional().describe('Written feedback commentary'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Rider Schema
 */
export const RiderSchema = registry.register(
  'Rider',
  z.object({
    _id: z.string().describe('MongoDB Rider Identifier'),
    user: z.string().describe('Associated User Profile ID'),
    firebaseUID: z.string().describe('Secure Firebase authentication UID link'),
    role: z.string().default('RIDER').describe('Profile role category'),
    fullName: z.string().describe('Driver full legal name'),
    email: z.string().email().optional().describe('Driver email contact'),
    phone: z.string().optional().describe('Driver mobile phone contact'),
    licenseNumber: z.string().optional().describe('Verified driver license number'),
    profileImage: z.string().optional().describe('Profile avatar URL path'),
    authProvider: z.string().default('firebase').describe('Selected authentication provider type'),
    isOnline: z.boolean().default(false).describe('Driver active online toggle flag'),
    isAvailable: z.boolean().default(false).describe('Driver active dispatch availability flag'),
    currentRide: z.string().nullable().optional().describe('ID of current active trip (if in progress)'),
    currentLocation: z.object({
      type: z.string().default('Point'),
      coordinates: z.array(z.number()).length(2).describe('Current coordinates [lng, lat]'),
    }).describe('Driver real-time geospatial location status'),
    walletBalance: z.number().default(0).describe('Rider personal wallet balance credit'),
    totalEarnings: z.number().default(0).describe('Driver total lifetime earnings in INR'),
    totalTrips: z.number().default(0).describe('Driver total lifetime trips finished'),
    averageRating: z.number().default(5.0).describe('Driver current aggregate stars rating'),
    deviceTokens: z.array(z.string()).describe('List of device FCM push tokens registered'),
    emergencyMode: z.boolean().default(false).describe('SOS / emergency trigger flag active status'),
    verificationStatus: z.enum(['pending', 'approved', 'rejected']).default('pending').describe('Administrative onboarding verification check'),
    documents: z.object({
      drivingLicense: z.object({ url: z.string(), status: z.string() }).optional(),
      insurance: z.object({ url: z.string(), status: z.string() }).optional(),
      rcBook: z.object({ url: z.string(), status: z.string() }).optional(),
      aadhaar: z.object({ url: z.string(), status: z.string() }).optional(),
      profilePhoto: z.object({ url: z.string(), status: z.string() }).optional(),
    }).optional().describe('Driver onboarding uploads status logs'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Schedule Schema
 */
export const ScheduleSchema = registry.register(
  'Schedule',
  z.object({
    _id: z.string().describe('MongoDB Schedule Identifier'),
    ride: z.string().describe('Associated Ride ID reference'),
    scheduledAt: z.string().datetime().describe('Timestamp when ride is scheduled to occur'),
    status: z.enum(['pending', 'scheduled', 'searching', 'assigned', 'started', 'completed', 'cancelled', 'expired']).default('scheduled').describe('Ride scheduling workflow status'),
    reminderSent: z.boolean().default(false).describe('Whether notification reminder was sent to user'),
    autoAssigned: z.boolean().default(true).describe('Whether system should auto-assign nearby drivers'),
    assignedRider: z.string().optional().nullable().describe('Assigned driver ID reference (if matched)'),
    activationTime: z.string().datetime().describe('Timestamp when matching engine will activate to find drivers'),
    cancellationDeadline: z.string().datetime().describe('Latest timestamp before which ride can be cancelled without fee'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

/**
 * Vehicle Schema
 */
export const VehicleSchema = registry.register(
  'Vehicle',
  z.object({
    _id: z.string().describe('MongoDB Vehicle Identifier'),
    rider: z.string().describe('Associated Rider Profile ID'),
    type: z.enum(['bike', 'cab', 'auto']).describe('Type of vehicle'),
    category: z.enum(['saver', 'premium', 'luxury']).describe('Category of service tier'),
    brand: z.string().describe('Vehicle brand (e.g. Maruti, Honda)'),
    modelName: z.string().describe('Vehicle model name (e.g. Swift, City)'),
    color: z.string().describe('Vehicle exterior color'),
    year: z.number().describe('Vehicle manufacture year'),
    numberPlate: z.string().describe('Unique standard registration license number plate'),
    seatingCapacity: z.number().describe('Passenger seating capacity of vehicle'),
    fuelType: z.enum(['petrol', 'diesel', 'electric', 'cng']).describe('Fuel type of vehicle'),
    vehicleImage: z.string().optional().describe('URL to vehicle photograph'),
    documents: z.object({
      rcBook: z.object({ url: z.string(), status: z.string() }).optional(),
      insurance: z.object({ url: z.string(), status: z.string() }).optional(),
      pollution: z.object({ url: z.string(), status: z.string() }).optional(),
      permit: z.object({ url: z.string(), status: z.string() }).optional(),
      fitnessCertificate: z.object({ url: z.string(), status: z.string() }).optional(),
    }).optional().describe('Vehicle document verification statuses'),
    isVerified: z.boolean().default(false).describe('Verification check state by admin'),
    isActive: z.boolean().default(false).describe('Whether vehicle is active driver dispatch selection'),
    verificationStatus: z.enum(['pending', 'approved', 'rejected']).default('pending').describe('Administrative onboarding verification check'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);










