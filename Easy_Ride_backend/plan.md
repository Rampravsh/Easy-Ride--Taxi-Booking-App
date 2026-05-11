# Ride Booking Backend API — Complete README (TypeScript + Advanced Features)

## Project Overview

This backend powers a production-grade ride-booking ecosystem similar to Uber/Ola/Rapido.

The platform includes:

* User Mobile App (React Native)
* Rider Mobile App (React Native)
* Admin Dashboard
* Real-time Ride Tracking
* Ride Pooling
* Scheduled Rides
* Wallet System
* Promo Codes
* Voice Calling
* In-App Chat
* Firebase Authentication
* Payments
* Notifications
* Analytics

---

# Technology Stack

| Layer              | Technology               |
| ------------------ | ------------------------ |
| Runtime            | Node.js                  |
| Language           | TypeScript               |
| Framework          | Express.js               |
| Database           | MongoDB + Mongoose       |
| Authentication     | Firebase Auth            |
| Real-time          | Socket.IO                |
| Cache              | Redis                    |
| Queue System       | BullMQ                   |
| Maps               | Google Maps API          |
| File Storage       | Cloudinary               |
| Push Notifications | Firebase Cloud Messaging |
| Payments           | Razorpay / Stripe        |
| Voice Calling      | Agora / Twilio           |
| Chat               | Socket.IO                |
| Logging            | Winston                  |
| Validation         | Zod                      |
| Deployment         | Docker + Nginx           |

---

# Recommended Modular MVC Architecture

```txt
backend/
│
├── src/
│   ├── config/             # Database, Firebase, and API configurations
│   │
│   ├── modules/            # Feature-based modular structure
│   │   ├── auth/           # Authentication & Token management
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validator.ts
│   │   ├── user/           # User profiles & settings
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   ├── rider/          # Rider management & tracking
│   │   │   ├── rider.controller.ts
│   │   │   ├── rider.service.ts
│   │   │   └── rider.routes.ts
│   │   ├── ride/           # Core Ride booking & lifecycle
│   │   │   ├── ride.controller.ts
│   │   │   ├── ride.service.ts
│   │   │   └── ride.routes.ts
│   │   ├── payment/        # Payments & Wallet
│   │   ├── promo/          # Promo codes
│   │   ├── chat/           # In-app messaging
│   │   ├── notification/   # Push notifications (FCM)
│   │   └── review/         # Ratings & Reviews
│   │
│   ├── shared/             # Shared resources across all modules
│   │   ├── models/         # Centralized Mongoose Schemas
│   │   ├── middlewares/    # Auth, Validation, Error handlers
│   │   ├── constants/      # Enums and static strings
│   │   ├── utils/          # Utility/Helper functions
│   │   ├── types/          # Global TypeScript types
│   │   └── interfaces/     # Shared TS interfaces
│   │
│   ├── sockets/            # Socket.IO event handlers & rooms
│   ├── jobs/               # Background task workers (BullMQ)
│   ├── cron/               # Scheduled cron jobs
│   │
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server entry point
│
├── uploads/                # Temporary file storage
├── logs/                   # Winston log files
├── tests/                  # Unit and Integration tests
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── .env
└── package.json
```

---

# Required Packages

# Core Dependencies

```bash
npm install express mongoose dotenv cors helmet morgan compression cookie-parser
```

---

# TypeScript Dependencies

```bash
npm install -D typescript ts-node-dev @types/node @types/express
```

---

# Type Definitions

```bash
npm install -D @types/cors @types/morgan @types/cookie-parser
```

---

# Firebase Authentication

```bash
npm install firebase-admin
```

---

# JWT Support (Optional Session Tokens)

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

---

# Validation

```bash
npm install zod
```

---

# Real-time Features

```bash
npm install socket.io
npm install -D @types/socket.io
```

---

# Redis + Queue

```bash
npm install ioredis bullmq
```

---

# File Upload

```bash
npm install multer cloudinary
npm install -D @types/multer
```

---

# Security

```bash
npm install bcrypt express-rate-limit hpp xss-clean
npm install -D @types/bcrypt
```

---

# Logging

```bash
npm install winston
```

---

# Maps & Geo Features

```bash
npm install geolib
```

---

# Payments

## Razorpay

```bash
npm install razorpay
```

---

# Voice Calling

## Twilio

```bash
npm install twilio
```

---

# Utility Packages

```bash
npm install uuid dayjs nanoid
```

---

# Development Dependencies

```bash
npm install -D nodemon eslint prettier
```

---

# Environment Variables

```env
PORT=5000

NODE_ENV=development

MONGO_URI=

REDIS_HOST=
REDIS_PORT=

GOOGLE_MAPS_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

FCM_PROJECT_ID=
FCM_PRIVATE_KEY=
FCM_CLIENT_EMAIL=
```

---

# Authentication Strategy

## Firebase Authentication

Authentication methods:

* Phone OTP
* Google Login
* Facebook Login

### Backend Flow

1. Frontend authenticates with Firebase
2. Frontend sends Firebase ID Token
3. Backend verifies token using Firebase Admin SDK
4. Backend creates/fetches user
5. Backend generates internal session if needed

---

# User Roles

```ts
enum UserRole {
  USER = 'user',
  RIDER = 'rider',
  ADMIN = 'admin'
}
```

---

# Database Schemas

# 1. User Schema

```ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  firebaseUID: string
  role: 'user'

  fullName: string
  email?: string
  phone?: string

  authProvider: 'phone' | 'google' | 'facebook'

  profileImage?: string

  walletBalance: number

  defaultPaymentMethod?: string

  rating: number

  savedAddresses: {
    label: string
    address: string
    location: {
      type: string
      coordinates: number[]
    }
  }[]

  deviceTokens: string[]

  isBlocked: boolean
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true
    },

    role: {
      type: String,
      default: 'user'
    },

    fullName: String,

    email: String,

    phone: String,

    authProvider: {
      type: String,
      enum: ['phone', 'google', 'facebook']
    },

    profileImage: String,

    walletBalance: {
      type: Number,
      default: 0
    },

    defaultPaymentMethod: String,

    rating: {
      type: Number,
      default: 5
    },

    savedAddresses: [
      {
        label: String,

        address: String,

        location: {
          type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
          },

          coordinates: [Number]
        }
      }
    ],

    deviceTokens: [String],

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)
```

---

# 2. Rider Schema

```ts
export interface IRider extends Document {
  firebaseUID: string

  role: 'rider'

  fullName: string

  email?: string

  phone?: string

  authProvider: 'phone' | 'google' | 'facebook'

  profileImage?: string

  isOnline: boolean

  isAvailable: boolean

  currentLocation: {
    type: string
    coordinates: number[]
  }

  vehicle: mongoose.Types.ObjectId

  documents: {
    license: string
    insurance: string
    rc: string
  }

  walletBalance: number

  totalEarnings: number

  totalTrips: number

  averageRating: number

  currentRide?: mongoose.Types.ObjectId
}
```

---

# 3. Vehicle Schema

```ts
export interface IVehicle extends Document {
  rider: mongoose.Types.ObjectId

  type: 'bike' | 'auto' | 'car'

  brand: string

  model: string

  color: string

  year: number

  numberPlate: string

  seatingCapacity: number

  isVerified: boolean
}
```

---

# 4. Ride Schema

```ts
export interface IRide extends Document {

  user: mongoose.Types.ObjectId

  rider?: mongoose.Types.ObjectId

  rideType: 'bike' | 'auto' | 'car'

  rideCategory: 'solo' | 'pool'

  status:
    | 'searching'
    | 'accepted'
    | 'arriving'
    | 'started'
    | 'completed'
    | 'cancelled'

  pickupLocation: {
    address: string
    coordinates: number[]
  }

  dropLocation: {
    address: string
    coordinates: number[]
  }

  routePath: number[][]

  estimatedDistance: number

  estimatedDuration: number

  actualDistance?: number

  actualDuration?: number

  baseFare: number

  surgeMultiplier: number

  taxAmount: number

  totalFare: number

  paymentMethod: 'cash' | 'wallet' | 'online'

  paymentStatus:
    | 'pending'
    | 'paid'
    | 'failed'

  scheduledAt?: Date

  isScheduled: boolean

  isPoolRide: boolean

  poolMembers: mongoose.Types.ObjectId[]

  otp: string

  startedAt?: Date

  completedAt?: Date

  cancelledBy?: 'user' | 'rider' | 'admin'

  cancellationReason?: string
}
```

---

# 5. Wallet Schema

```ts
export interface IWallet extends Document {

  user: mongoose.Types.ObjectId

  balance: number

  currency: string
}
```

---

# 6. Wallet Transaction Schema

```ts
export interface IWalletTransaction extends Document {

  wallet: mongoose.Types.ObjectId

  type:
    | 'credit'
    | 'debit'

  amount: number

  reason:
    | 'ride_payment'
    | 'refund'
    | 'wallet_topup'
    | 'promo_reward'

  status:
    | 'pending'
    | 'success'
    | 'failed'
}
```

---

# 7. Promo Code Schema

```ts
export interface IPromoCode extends Document {

  code: string

  description: string

  discountType:
    | 'flat'
    | 'percentage'

  discountValue: number

  maxDiscount?: number

  minimumRideAmount?: number

  usageLimit: number

  usedCount: number

  validFrom: Date

  validTill: Date

  applicableRideTypes: string[]

  isActive: boolean
}
```

---

# 8. Ride Pool Schema

```ts
export interface IRidePool extends Document {

  ride: mongoose.Types.ObjectId

  riders: mongoose.Types.ObjectId[]

  maxPassengers: number

  currentPassengers: number

  optimizedRoute: number[][]

  fareDistribution: number[]
}
```

---

# 9. Chat Schema

```ts
export interface IChatMessage extends Document {

  ride: mongoose.Types.ObjectId

  sender: mongoose.Types.ObjectId

  senderType: 'user' | 'rider'

  message: string

  messageType:
    | 'text'
    | 'image'
    | 'location'

  isRead: boolean
}
```

---

# 10. Call Session Schema

```ts
export interface ICallSession extends Document {

  ride: mongoose.Types.ObjectId

  caller: mongoose.Types.ObjectId

  receiver: mongoose.Types.ObjectId

  callProvider: 'agora' | 'twilio'

  channelName: string

  startedAt: Date

  endedAt?: Date

  duration?: number
}
```

---

# 11. Review Schema

```ts
export interface IReview extends Document {

  ride: mongoose.Types.ObjectId

  user: mongoose.Types.ObjectId

  rider: mongoose.Types.ObjectId

  rating: number

  comment: string
}
```

---

# MongoDB Indexes

```ts
RiderSchema.index({
  currentLocation: '2dsphere'
})

RideSchema.index({
  pickupLocation: '2dsphere'
})

RideSchema.index({
  dropLocation: '2dsphere'
})
```

---

# Ride Status Flow

```txt
REQUESTED
    ↓
SEARCHING_RIDER
    ↓
RIDER_ACCEPTED
    ↓
RIDER_ARRIVING
    ↓
OTP_VERIFIED
    ↓
RIDE_STARTED
    ↓
RIDE_COMPLETED
    ↓
PAYMENT_SUCCESS
    ↓
REVIEW_SUBMITTED
```

---

# API Endpoints

# Authentication APIs

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | /api/auth/firebase | Verify Firebase token |
| POST   | /api/auth/logout   | Logout user           |
| GET    | /api/auth/me       | Current logged user   |

---

# User APIs

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/users/profile         |
| PUT    | /api/users/profile         |
| POST   | /api/users/address         |
| GET    | /api/users/rides           |
| POST   | /api/users/favorite-riders |

---

# Rider APIs

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/riders/profile  |
| PUT    | /api/riders/profile  |
| PUT    | /api/riders/location |
| PUT    | /api/riders/status   |
| GET    | /api/riders/earnings |

---

# Ride APIs

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | /api/rides/estimate         |
| POST   | /api/rides/book             |
| POST   | /api/rides/schedule         |
| POST   | /api/rides/pool             |
| GET    | /api/rides/:rideId          |
| PUT    | /api/rides/:rideId/cancel   |
| PUT    | /api/rides/:rideId/accept   |
| PUT    | /api/rides/:rideId/start    |
| PUT    | /api/rides/:rideId/complete |

---

# Wallet APIs

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/wallet              |
| POST   | /api/wallet/topup        |
| GET    | /api/wallet/transactions |

---

# Promo APIs

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/promos/apply  |
| GET    | /api/promos/active |

---

# Chat APIs

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/chat/:rideId/messages |
| POST   | /api/chat/send             |

---

# Voice Call APIs

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/calls/token |
| POST   | /api/calls/start |
| POST   | /api/calls/end   |

---

# Review APIs

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/reviews           |
| GET    | /api/reviews/rider/:id |

---

# Admin APIs

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | /api/admin/users         |
| GET    | /api/admin/riders        |
| PUT    | /api/admin/riders/verify |
| GET    | /api/admin/analytics     |
| PUT    | /api/admin/block-user    |

---

# Socket.IO Events

# User Events

```txt
join-user-room
book-ride
cancel-ride
track-rider
send-message
start-call
```

---

# Rider Events

```txt
join-rider-room
accept-ride
reject-ride
update-location
send-message
receive-call
```

---

# Server Events

```txt
ride-requested
ride-accepted
ride-started
ride-completed
rider-location-updated
new-message
incoming-call
payment-success
```

---

# Scheduled Ride System

## Features

* Schedule ride for future
* Auto rider allocation
* Reminder notifications
* Auto cancellation timeout

## Recommended Cron Jobs

```txt
Every 1 minute:
- Check upcoming rides
- Allocate riders
- Send reminders
```

---

# Ride Pooling Logic

## Requirements

* Route similarity detection
* Passenger capacity validation
* Dynamic fare splitting
* Pickup/drop optimization

## Matching Strategy

* Same direction
* Similar ETA
* Distance threshold
* Seat availability

---

# Wallet System

## Features

* Wallet recharge
* Auto ride deduction
* Cashback
* Refund support

## Transaction Types

```txt
credit
debit
refund
reward
topup
```

---

# Promo Code System

## Features

* Percentage discounts
* Flat discounts
* Expiry validation
* User-specific promos
* First ride offers

---

# Chat System

## Features

* Real-time messaging
* Ride-specific chat room
* Media sharing
* Read receipts

---

# Voice Calling System

## Recommended

## Agora

Advantages:

* Low latency
* Better mobile optimization
* Easier scaling

---

# Notification System

## Push Notifications

Using Firebase Cloud Messaging.

### Events

* Ride accepted
* Rider arrived
* Ride started
* Ride completed
* Payment success
* Promo offers

---

# Ride Matching Algorithm

## Matching Criteria

1. Nearest rider
2. Rider availability
3. Rider rating
4. Vehicle type
5. Current trip load
6. Pool compatibility

---

# Geo Search Example

```ts
const nearbyRiders = await Rider.find({
  currentLocation: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },

      $maxDistance: 5000
    }
  },

  isOnline: true,

  isAvailable: true
})
```

---

# Security Best Practices

## Mandatory

* Firebase token verification
* HTTPS
* Rate limiting
* Helmet
* Input sanitization
* Geo request validation
* Mongo query sanitization
* Secure file uploads
* API throttling

---

# Middleware Requirements

# Authentication Middleware

* Verify Firebase token
* Attach user
* Role authorization

---

# Validation Middleware

Validate:

* Body
* Params
* Query
* Geo coordinates

---

# Error Middleware

Centralized error handling.

---

# Redis Usage

## Recommended Use Cases

* Active rider cache
* OTP cache
* Surge pricing cache
* Socket session storage
* Chat message queue
* Scheduled ride queue

---

# Queue Jobs

Using BullMQ.

## Background Jobs

* Push notifications
* Email sending
* Ride scheduling
* Payment verification
* Analytics generation

---

# Logging System

Using Winston.

## Log Types

* API logs
* Error logs
* Payment logs
* Socket logs
* Rider tracking logs

---

# Suggested Service Architecture

```txt
Controllers
    ↓
Services
    ↓
Repositories
    ↓
MongoDB
```

---

# Recommended Deployment Stack

## Production Infrastructure

| Component    | Recommendation |
| ------------ | -------------- |
| API Hosting  | AWS            |
| Database     | MongoDB Atlas  |
| Redis        | Redis Cloud    |
| CDN          | Cloudflare     |
| File Storage | Cloudinary     |
| Monitoring   | Datadog        |

---

# Docker Setup

## Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
```

---

# Docker Compose

```yaml
version: '3'

services:

  api:
    build: .
    ports:
      - "5000:5000"

  redis:
    image: redis

  mongodb:
    image: mongo
```

---

# Recommended Development Phases

# Phase 1

* Firebase authentication
* User/rider modules
* MongoDB setup
* JWT/session setup

---

# Phase 2

* Ride booking
* Nearby rider matching
* Real-time sockets

---

# Phase 3

* Payments
* Wallet
* Notifications

---

# Phase 4

* Ride pooling
* Scheduled rides
* Promo system

---

# Phase 5

* Chat
* Voice calling
* Analytics

---

# Phase 6

* Admin dashboard
* Scaling
* Optimization

---

# Scalability Recommendations

## Important

* Use Redis aggressively
* Separate socket server
* Use queues for notifications
* Use geo indexes everywhere
* Keep ride state atomic
* Use database transactions
* Avoid heavy aggregation in APIs

---

# Recommended Future Enhancements

## Advanced Features

* AI demand prediction
* Dynamic surge pricing
* Subscription plans
* Heatmaps
* Driver incentives
* SOS emergency system
* Fraud detection
* Multi-city support
* Corporate rides
* EV charging support

---

# Final Engineering Recommendations

The most complex areas of the system are:

1. Real-time rider tracking
2. Geo-spatial queries
3. Ride state synchronization
4. Pool ride optimization
5. Payment reliability
6. Socket scaling
7. Queue processing
8. Scheduled ride orchestration

For production scale:

* Use microservices eventually
* Separate chat/call services
* Use Redis Pub/Sub
* Add horizontal socket scaling
* Use CDN for uploads
* Use monitoring from day one
* Implement distributed tracing
* Add API versioning (`/api/v1`) early
