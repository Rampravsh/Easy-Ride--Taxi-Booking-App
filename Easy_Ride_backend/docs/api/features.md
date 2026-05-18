# Advanced Features API Reference

Documentation for Ride Pooling (Easy Pool), Advance Ride Scheduling, and Promotional Discount coupon systems.

---

## 🤝 Ride Pooling (Easy Pool)

Smart route-matching system grouping passengers headed in matching directions.

### 1. Join Active Ride Pool
Requests placement into a pooling matching queue with matching target coordinates.
- **URL**: `/api/v1/pool/join`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "rideId": "60d5ecb31f24f5a4a4f8e901",
  "pickupCoordinates": [77.5946, 12.9716],
  "dropCoordinates": [77.6256, 12.9348]
}
```

### 2. Leave Ride Pool
- **URL**: `/api/v1/pool/leave`
- **Method**: `POST`

---

## 📅 Advance Ride Scheduling

Schedule rides in advance. System automatically activates matching loops 15 minutes before the pickup timestamp using BullMQ schedules.

### 1. Schedule a Future Ride
- **URL**: `/api/v1/schedules`
- **Method**: `POST`
- **Body**:
```json
{
  "rideId": "60d5ecb31f24f5a4a4f8e901",
  "scheduledAt": "2026-05-19T08:30:00.000Z",
  "autoAssigned": true
}
```

### 2. List My Scheduled Rides
Retrieves upcoming advance bookings.
- **URL**: `/api/v1/schedules`
- **Method**: `GET`

### 3. Cancel Scheduled Ride
- **URL**: `/api/v1/schedules/:id/cancel`
- **Method**: `PUT`

---

## 🎟️ Promo Codes & Cashbacks

Allows applying discounts or referral rewards during checkout.

### 1. Validate Promo Code
Checks if coupon is active, fits trip category, and isn't expired.
- **URL**: `/api/v1/promos/validate`
- **Method**: `POST`
- **Body**: `{ "code": "EASY25", "rideId": "60d5ecb31f24f5a4a4f8e901" }`

### 2. Apply Promo Code
Redeems discount points on active bookings.
- **URL**: `/api/v1/promos/apply`
- **Method**: `POST`
- **Body**: `{ "code": "EASY25", "rideId": "60d5ecb31f24f5a4a4f8e901" }`
