# API Reference Index

This directory contains detailed documentation for all REST API endpoints.

## 🔐 [Authentication](./authentication.md)
Firebase login, registration, and role management.

## 🚠 [Ride Lifecycle](./rides.md)
Estimates, bookings, and ride state transitions.

## 💳 [Payments & Wallets](./payments.md)
Razorpay integration, wallet top-ups, and transaction history.

## 👤 [Users & Riders](./users.md)
Profile management, vehicle details, and rider verification.

## 💬 [Communication](./communication.md)
In-app chat, calling, and push notifications.

## 🛠️ [Advanced Features](./features.md)
Ride pooling, scheduled rides, and promo codes.

## 📊 [Admin & Analytics](./admin.md)
Platform management, monitoring, and fraud detection.

---

## 📡 Standard Response Format
All successful responses return:
```json
{
  "status": "success",
  "message": "...",
  "data": { ... }
}
```

## 🔢 Pagination
For list endpoints, use `page` and `limit` query parameters.
```bash
GET /api/v1/rides?page=2&limit=10
```
Response includes `pagination` metadata:
```json
{
  "pagination": {
    "total": 100,
    "page": 2,
    "limit": 10,
    "pages": 10
  }
}
```
