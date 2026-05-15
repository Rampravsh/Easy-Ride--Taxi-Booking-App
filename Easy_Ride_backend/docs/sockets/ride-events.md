# Ride Real-time Events

The Ride lifecycle is heavily driven by Socket.IO to ensure both the user and rider have zero-latency updates.

## 📡 Events Overview

### 1. `ride:requested` (Server -> Rider)
Emitted to all eligible riders in the vicinity when a new ride is booked.

- **Payload**:
```json
{
  "rideId": "60d5ecb31f24f5a4a4f8e912",
  "pickupAddress": "123 Main St",
  "dropAddress": "456 Office Pkwy",
  "fare": 250.50,
  "distance": 5.2
}
```

---

### 2. `ride:accepted` (Server -> User)
Emitted to the user when a rider accepts their request.

- **Payload**:
```json
{
  "rideId": "60d5ecb31f24f5a4a4f8e912",
  "rider": {
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "rating": 4.8
  },
  "vehicle": {
    "model": "Toyota Camry",
    "plateNumber": "ABC-1234"
  }
}
```

---

### 3. `rider:location_update` (Rider -> Server)
Sent by the rider's app every 3-5 seconds to update their live coordinates.

- **Payload**:
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "heading": 180
}
```

---

### 4. `ride:location_sync` (Server -> User)
Broadcasted to the user's room to show the rider's movement on the map.

- **Payload**:
```json
{
  "rideId": "60d5ecb31f24f5a4a4f8e912",
  "coordinates": [77.5946, 12.9716],
  "heading": 180,
  "eta": 5
}
```

---

### 5. `ride:started` (Server -> User)
Emitted when the rider starts the trip after OTP verification.

---

### 6. `ride:completed` (Server -> User)
Emitted when the trip ends. Usually triggers the payment processing flow.

---

## 🏗️ Socket Room Architecture
- **User Room**: `user:{userId}` - Private events for the user.
- **Rider Room**: `rider:{riderId}` - Private events for the rider.
- **Ride Room**: `ride:{rideId}` - Shared events for both user and rider (e.g., location sync).

---

## 🔒 Authentication
All socket connections require a `Firebase ID Token` passed in the `auth` object during initialization.

```javascript
const socket = io(SERVER_URL, {
  auth: {
    token: "FIREBASE_ID_TOKEN"
  }
});
```
