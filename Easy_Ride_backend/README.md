# 🚕 Easy Ride - Enterprise Taxi Booking Backend

Welcome to the **Easy Ride Backend**! Yeh ek modular aur scalable enterprise-grade backend system hai jo modern taxi-booking apps ke saare features provide karta hai. Isme modular architecture use kiya gaya hai taki maintainability aur scalability top-notch rahe.

---

## 🏗️ Architecture & Technology Stack

Backend ko **Clean Architecture** patterns ko follow karte hue design kiya gaya hai. Har ek feature apne independent module me hai.

- **Runtime**: Node.js
- **Language**: TypeScript (Strongly Typed)
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: Firebase Admin SDK
- **Payment Gateway**: Razorpay
- **Real-time Communication**: Socket.io
- **Background Tasks**: BullMQ (Redis-based)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston & Morgan

---

## 📂 Project Structure (File-by-File Explanation)

Backend structure kuch is tarah hai:

### 1. `src/server.ts`
Project ka **Entry Point**. Yeh server ko initialize karta hai, database connect karta hai, aur listener start karta hai.

### 2. `src/app.ts`
Express app ki configuration. Middlewares registration aur base route definition yahin hoti hai.

### 3. `src/modules/` (The Core Logic)
Har module me usually yeh files hoti hain:
- `*.routes.ts`: API endpoints define karta hai.
- `*.controller.ts`: Request/Response handle karta hai.
- `*.service.ts`: Business logic contain karta hai.
- `*.repository.ts`: Database interactions handle karta hai.
- `*.model.ts`: Mongoose schema/model.
- `*.validation.ts`: Zod validation schemas.

#### 📦 Key Modules:
- **`auth/`**: Firebase integration ke saath authentication handle karta hai.
- **`user/`**: Users ke profiles, addresses aur preferences manage karta hai.
- **`rider/`**: Drivers (Riders) ke profile, status aur earnings handle karta hai.
- **`ride/`**: Ride lifecycle (Estimate -> Book -> Accept -> Start -> Complete).
- **`vehicle/`**: Rider ke vehicles aur unki verification.
- **`wallet/`**: User/Rider balance aur history.
- **`payment/`**: Razorpay orders aur webhook integration.
- **`chat/`**: Ride-based real-time chat between user and rider.
- **`call/`**: Audio/Video call signaling and history.
- **`promo/`**: Discount codes aur referral logic.
- **`notification/`**: Push notifications (FCM) management.

---

## 🚀 Exhaustive API Reference

Saare APIs `/api/v1` prefix ke saath chalti hain.

### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/firebase` | Login/Signup using Firebase Token | Public |

### 👤 User Module (`/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/profile` | Get user profile info | Protected |
| PUT | `/profile` | Update profile details | Protected |
| POST | `/profile-image` | Upload profile picture | Protected |
| POST | `/address` | Save new address | Protected |
| DELETE | `/address/:id` | Remove saved address | Protected |
| PUT | `/device-token` | Update FCM device token | Protected |
| GET | `/preferences` | Get user app preferences | Protected |
| PUT | `/preferences` | Update app preferences | Protected |

### 🏍️ Rider Module (`/riders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/profile` | Get rider details | Rider |
| PUT | `/profile` | Update rider details | Rider |
| PUT | `/status` | Update Online/Offline status | Rider |
| PUT | `/location` | Update live coordinates | Rider |
| PUT | `/availability` | Toggle availability status | Rider |
| PUT | `/device-token` | Update FCM device token | Rider |
| GET | `/earnings` | Get daily/weekly earnings | Rider |
| GET | `/current-ride` | Get current active ride | Rider |

### 🚗 Ride Module (`/rides`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/estimate` | Get fare estimate (Distance/Time) | Protected |
| POST | `/book` | Request a new ride | User |
| GET | `/:rideId` | Get specific ride details | Protected |
| PUT | `/:rideId/accept` | Rider accepts a request | Rider |
| PUT | `/:rideId/arrived` | Rider arrived at pickup | Rider |
| PUT | `/:rideId/start` | Start the trip (OTP Required) | Rider |
| PUT | `/:rideId/complete`| End the trip | Rider |
| PUT | `/:rideId/cancel` | Cancel the ride | Protected |

### 🏎️ Vehicle Module (`/vehicles`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Register a new vehicle | Rider |
| GET | `/my-vehicles` | Get list of own vehicles | Rider |
| GET | `/:vehicleId` | Get vehicle details | Protected |
| PUT | `/:vehicleId` | Update vehicle details | Rider |
| DELETE| `/:vehicleId` | Remove a vehicle | Rider |
| PUT | `/:vehicleId/status`| Toggle active status | Rider |
| PUT | `/:vehicleId/verify`| Verify vehicle | Admin |

### 💳 Wallet & Transactions (`/wallet`, `/transactions`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/wallet` | Get current wallet balance | Protected |
| GET | `/wallet/transactions` | Get wallet specific history | Protected |
| GET | `/transactions` | Get all user transactions | Protected |
| GET | `/transactions/:id`| Get transaction details | Protected |

### 💰 Payments (`/payments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/create-order` | Create Razorpay order | Protected |
| POST | `/verify` | Verify payment status | Protected |
| POST | `/refund` | Refund a payment | Admin |
| POST | `/webhook` | Razorpay background updates | Public |

### 💬 Communication (`/chat`, `/calls`, `/notifications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/chat/send` | Send message in a ride | Protected |
| GET | `/chat/:rideId/messages` | Get chat history | Protected |
| GET | `/chat/unread-count` | Get unread messages count | Protected |
| PUT | `/chat/:rideId/read` | Mark chat as read | Protected |
| POST | `/calls/initiate` | Start a new call | Protected |
| POST | `/calls/:id/accept` | Accept incoming call | Protected |
| POST | `/calls/:id/reject` | Reject incoming call | Protected |
| POST | `/calls/:id/end` | End active call | Protected |
| GET | `/calls/history` | Get call logs | Protected |
| GET | `/notifications` | Get notification history | Protected |
| GET | `/notifications/unread-count`| Get unread count | Protected |
| PUT | `/notifications/:id/read` | Mark as read | Protected |
| PUT | `/notifications/read-all` | Mark all as read | Protected |

### 🎟️ Promo & Scheduling (`/promos`, `/schedules`, `/pool`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/promos/validate` | Validate promo code | Protected |
| POST | `/promos/apply` | Apply promo to ride | Protected |
| POST | `/schedules` | Schedule a future ride | Protected |
| GET | `/schedules` | List scheduled rides | Protected |
| PUT | `/schedules/:id/cancel`| Cancel scheduled ride | Protected |
| POST | `/pool/join` | Join a ride pool | Protected |
| POST | `/pool/leave` | Leave a ride pool | Protected |

### ⚖️ Review & Monitoring (`/reviews`, `/monitoring`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/reviews` | Create a new review | Protected |
| GET | `/reviews/ride/:id` | Get reviews for a ride | Protected |
| GET | `/reviews/user/:id` | Get reviews for a user | Protected |
| GET | `/monitoring/health`| Server health check | Public |
| GET | `/monitoring/metrics`| System metrics | Public |

### 🛠️ Admin & Analytics (`/admin`, `/analytics`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/admin/dashboard` | Get platform stats | Admin |
| PUT | `/admin/riders/:id/verify` | Verify rider account | Admin |
| GET | `/analytics/overview`| Platform overview data | Admin |
| GET | `/analytics/revenue` | Revenue analytics data | Admin |

---

## 🛠️ Setup Instructions

1. **Clone the Repo**
2. **Install Dependencies**: `npm install`
3. **Setup Environment**: `.env` file create karein (Reference `.env.example`).
4. **Run in Dev Mode**: `npm run dev`
5. **Build for Prod**: `npm run build`

---

## 🔑 Environment Variables

Make sure you have these in your `.env`:
- `PORT`: Server port (default 5000)
- `MONGODB_URL`: Your MongoDB connection string
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `REDIS_HOST`, `REDIS_PORT`

---

Developed with ❤️ for **Easy Ride**.
