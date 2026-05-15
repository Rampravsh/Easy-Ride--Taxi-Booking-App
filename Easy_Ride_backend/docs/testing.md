# Testing Standards

We prioritize reliability through a comprehensive testing strategy covering APIs, Sockets, and Background Jobs.

## 🧪 Testing Stack
- **Framework**: Jest
- **API Testing**: Supertest
- **Mocking**: Jest Mocks, Mongo-Memory-Server
- **Socket Testing**: `socket.io-client`

---

## 🏗️ Test Structure
Tests are co-located with their modules or stored in the `tests/` directory.
- `*.spec.ts`: Unit tests
- `*.test.ts`: Integration tests

---

## 📋 Running Tests

### All Tests
```bash
npm test
```

### Coverage Report
```bash
npm test -- --coverage
```

---

## 🛠️ Mocking Strategy

### 1. Database
Use `mongodb-memory-server` to run a real MongoDB instance in memory for integration tests.

### 2. External Providers
Never call real APIs (Razorpay, Twilio) during tests. Use mocked providers:
```typescript
jest.mock('../../modules/payment/providers/razorpay.provider', () => ({
  createOrder: jest.fn().mockResolvedValue({ id: 'order_123' }),
}));
```

### 3. Firebase
Mock the `firebase-admin` auth verify method to return a dummy user.

---

## ⚡ Socket.IO Testing
To test real-time events, use the `socket.io-client` to connect to a test server instance.

```typescript
const clientSocket = io(`http://localhost:${testPort}`);
clientSocket.on('ride:accepted', (data) => {
  expect(data.rideId).toBe(mockRideId);
  done();
});
```

---

## ⛓️ Queue Testing
Test BullMQ jobs by instantiating the job handler directly with a mock `Job` object.
```typescript
await notificationWorker.process(mockJob);
expect(emailProvider.send).toHaveBeenCalled();
```
