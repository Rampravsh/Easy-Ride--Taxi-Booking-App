# Easy Ride - Taxi Booking App Backend

A production-grade, scalable backend for a ride-booking system built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Technology Stack

- **Core**: Node.js, Express.js, TypeScript
- **Database**: MongoDB + Mongoose, Redis (for caching & queues)
- **Authentication**: Firebase Authentication
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Infrastructure**: Docker, BullMQ (for background jobs)

## 🏗️ Architecture

The project follows a **Feature-Based Modular MVC** architecture with a **Service-Repository** pattern.

- **Controllers**: Handle request/response and input validation.
- **Services**: Contain business logic and orchestrate operations.
- **Repositories**: Direct database interaction and data mapping.
- **Shared**: Reusable enums, interfaces, error handlers, and utilities.

## 🔐 Authentication Module

The authentication system is powered by **Firebase Authentication** for cross-platform ease (Phone, Google, Facebook login).

### Flow:
1. Client authenticates with Firebase and receives an `idToken`.
2. Client sends the token to `POST /api/v1/auth/firebase`.
3. Backend verifies the token using the `firebase-admin` SDK.
4. Backend creates/retrieves the local `User` (and `Rider` profile if applicable).
5. Subsequent requests are authenticated via the `Authorization: Bearer <idToken>` header.

### Endpoints:
- `POST /api/v1/auth/firebase`: Authenticate with Firebase token.
  - Body: `{ "token": "...", "role": "user" | "rider" | "admin" }`

## 🛠️ Setup & Installation

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Setup `.env` file (see `.env.example`).
4. Run in development: `npm run dev`.

## 🧪 Testing
Run tests using: `npm test`
