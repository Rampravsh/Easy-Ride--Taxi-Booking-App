# Queue System (BullMQ)

Easy Ride leverages **BullMQ** (backed by Redis) for high-performance, distributed background processing.

## 🏗️ Architecture

All long-running or non-critical path operations are offloaded to background workers to ensure the REST and Socket APIs remain responsive.

### 1. Job Producers
Services add jobs to specific queues when an event occurs (e.g., `RideService` adds a job to `notificationQueue` after a booking).

### 2. Job Consumers (Workers)
Stateless workers listen to queues and process jobs. They can be scaled independently of the main API server.

---

## 📋 Standard Queues

### 1. `notificationQueue`
Handles all outbound communications.
- **Jobs**: Push notifications (FCM), SMS (Twilio), Emails.
- **Retry Strategy**: 3 retries with exponential backoff (1s, 2s, 4s).

### 2. `rideQueue`
Manages complex ride lifecycle logic.
- **Jobs**: Matching timeout (find next rider), Scheduled ride activation, Surge pricing updates.

### 3. `paymentQueue`
Handles transactional integrity and webhooks.
- **Jobs**: Wallet balance synchronization, Refund processing, Payout distributions.

### 4. `analyticsQueue`
Processes raw events for the analytics dashboard.
- **Jobs**: Trip distance calculation, Earnings aggregation, Fraud pattern detection.

---

## 🛠️ Configuration

Queues are initialized in `src/jobs/index.ts`.

```typescript
const defaultOptions = {
  removeOnComplete: true,
  removeOnFail: false,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};
```

---

## 📈 Monitoring
We use **BullBoard** (available at `/admin/queues` for Super Admins) to monitor:
- Active jobs
- Waiting jobs
- Failed jobs (with stack traces)
- Completed jobs throughput

---

## 🛡️ Best Practices
- **Idempotency**: Every job handler is designed to be idempotent to handle retries safely.
- **Atomic Operations**: Using MongoDB transactions within jobs where multiple collections are updated.
- **Separate Workers**: Production deployments run workers in separate processes or containers from the web API.
