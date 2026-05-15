# Easy Ride Backend Documentation

Welcome to the official technical documentation for the **Easy Ride** backend platform. This platform is a production-grade, real-time ride-booking engine built with performance, scalability, and maintainability in mind.

## 🚀 Platform Overview

Easy Ride is a feature-rich ride-hailing solution that supports real-time rider matching, live tracking, secure payments, and complex ride lifecycles (including pooling and scheduling).

### Key Technologies
- **Core**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.IO, Redis Pub/Sub
- **Caching & Geo-indexing**: Redis
- **Background Jobs**: BullMQ
- **Auth**: Firebase Authentication
- **Payments**: Razorpay
- **Communications**: Firebase Cloud Messaging (FCM), Twilio
- **Observability**: Prometheus, Grafana, Winston, Morgan

---

## 📂 Documentation Structure

### 🏗️ [Architecture](./architecture.md)
Detailed breakdown of the Modular MVC, Service-Repository pattern, and system design.

### 🛠️ [Setup & Operations](./setup.md)
- [Environment Configuration](./environment.md)
- [Deployment Guide](./deployment.md)
- [Testing Standards](./testing.md)

### 🔌 [API Reference](./api/README.md)
- [Authentication](./api/authentication.md)
- [User Management](./api/users.md)
- [Rider & Vehicle](./api/riders.md)
- [Ride Lifecycle](./api/rides.md)
- [Wallets & Payments](./api/payments.md)
- [Full OpenAPI Spec](./swagger/openapi.yaml)

### ⚡ [Real-time & Sockets](./realtime.md)
- [Socket.IO Event Docs](./sockets/connection.md)
- [Tracking Flow](./sockets/tracking.md)
- [Chat & Presence](./sockets/presence.md)

### ⛓️ [Infrastructure](./queues.md)
- [Queue System (BullMQ)](./queues.md)
- [Redis Architecture](./redis.md)
- [Monitoring & Analytics](./monitoring.md)

### 🌊 [Workflows & Flows](./flows/ride-booking-flow.md)
- [Ride Booking Lifecycle](./flows/ride-booking-flow.md)
- [Payment & Refund Flow](./flows/payment-flow.md)
- [Pooling & Scheduling](./flows/pooling-flow.md)

### 🛡️ [Security & Compliance](./security.md)
- Firebase Auth Integration
- RBAC & Rate Limiting
- Fraud Detection

---

## 🆘 Troubleshooting
Common issues and resolutions can be found in the [Troubleshooting Guide](./troubleshooting.md).

---

## 📝 Coding Standards
We follow strict TypeScript standards and a modular approach. See [Architecture](./architecture.md) for more details.
