# Backend Architecture

Easy Ride utilizes a **Scalable Monolith** architecture, designed with strict modularity to allow for a future transition to microservices if needed.

## 🏛️ Core Design Patterns

### 1. Modular MVC (Model-View-Controller)
The codebase is organized into feature-based modules (e.g., `auth`, `ride`, `payment`). Each module contains its own routes, controllers, and business logic.

### 2. Service-Repository Pattern
To decouple business logic from data access:
- **Controllers**: Handle HTTP/Socket requests, validate input, and call services.
- **Services**: Contain core business logic. They are thin wrappers around repositories or providers.
- **Repositories**: Handle database operations (Mongoose models).
- **Providers**: Interfaces for third-party services (Razorpay, Twilio, Firebase).

### 3. Provider Pattern
External integrations (Sms, Email, Payments) are abstracted using providers. This allows for easy swapping of vendors (e.g., switching from Twilio to MessageBird) without touching business logic.

---

## 🏗️ Folder Structure

```
src/
├── config/             # Global configurations (App, DB, Redis, Firebase)
├── modules/            # Feature-based modules
│   ├── ride/           # Example: Ride module
│   │   ├── ride.controller.ts
│   │   ├── ride.service.ts
│   │   ├── ride.repository.ts
│   │   ├── ride.routes.ts
│   │   ├── ride.model.ts
│   │   └── ride.validation.ts
│   └── ...
├── sockets/            # Core Socket.IO infrastructure
├── jobs/               # BullMQ worker and queue definitions
├── shared/             # Shared utilities, enums, interfaces, and errors
├── middlewares/        # Global Express middlewares
└── server.ts           # Application entry point
```

---

## 🔄 Event-Driven Architecture

The system uses an event-driven approach for non-blocking operations:
1. **Socket.IO**: For real-time bi-directional communication (tracking, chat).
2. **BullMQ**: For asynchronous background processing (notifications, payment processing, ride matching).
3. **Redis Pub/Sub**: For horizontal scaling of Socket.IO and inter-service messaging.

---

## 📈 Scaling Strategy
- **Horizontal Scaling**: The app is stateless. Multiple instances can run behind a Load Balancer.
- **Socket Sticky Sessions**: Required for Socket.IO when using multiple instances.
- **Redis Adapter**: Synchronizes socket events across multiple nodes.
- **Database Sharding**: Planned for MongoDB as data grows.

---

## 🛡️ Observability
- **Correlation IDs**: Track requests across multiple services and logs.
- **Centralized Logging**: Using Winston with rotating files.
- **Metrics**: Exported via Prometheus for Grafana dashboards.
