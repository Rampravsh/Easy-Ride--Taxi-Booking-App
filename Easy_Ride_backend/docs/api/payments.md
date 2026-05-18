# Payments, Wallet & Transactions API Reference

Easy Ride supports a multi-modal payment system including in-app Wallet debits, Cash collections, and Online instant payments backed by Razorpay gateway integration.

---

## 💳 Wallet Management

Passenger/Rider wallet balances, transaction logs, and secure status states.

### 1. Get Wallet Details
Retrieves current balance, default currency, and latest transaction hooks. Automatically creates a wallet record for a newly signed-up passenger profile if missing.
- **URL**: `/api/v1/wallet`
- **Method**: `GET`
- **Auth**: Required
- **Response Example (200 OK)**:
```json
{
  "status": "success",
  "message": "Wallet fetched successfully",
  "data": {
    "_id": "60d5ecb31f24f5a4a4f8e920",
    "user": "60d5ecb31f24f5a4a4f8e910",
    "balance": 1250.75,
    "currency": "INR",
    "isBlocked": false,
    "createdAt": "2026-05-15T10:00:00.000Z",
    "updatedAt": "2026-05-18T09:00:00.000Z"
  }
}
```

---

## 💸 Razorpay Payments & Top-ups

Online payments are processed under the `/payments` router group.

### 1. Initiate Wallet Top-up (Create Razorpay Order)
Creates a verified orders transaction index on Razorpay gateway. Returns the unique order ID to be fetched by Razorpay mobile checkout SDK.
- **URL**: `/api/v1/payments/create-order`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "amount": 500
}
```
- **Response Example (201 Created)**:
```json
{
  "status": "success",
  "message": "Topup order created successfully",
  "data": {
    "id": "order_Hkp12345XYZ",
    "amount": 50000,
    "currency": "INR",
    "receipt": "receipt_wallet_topup_1684345200"
  }
}
```

### 2. Verify Razorpay Payment Signature
Validates transaction integrity using HMAC-SHA256 signature matching. Credits the wallet balance on success.
- **URL**: `/api/v1/payments/verify`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "razorpay_order_id": "order_Hkp12345XYZ",
  "razorpay_payment_id": "pay_Hkq98765ABC",
  "razorpay_signature": "6c459f2701bfdae01bbcf76008db692b6a55d49ec23cdb1297..."
}
```

### 3. Process Payment Refund (Admins Only)
- **URL**: `/api/v1/payments/refund`
- **Method**: `POST`
- **Auth**: Required (Admin only)
- **Body**: `{ "paymentId": "60d5ecb31f24f5a4a4f8e950", "amount": 250 }`

### 4. Razorpay Webhook Callback
Processes async callback reports from Razorpay (capturing failures, disputes, chargebacks).
- **URL**: `/api/v1/payments/webhook`
- **Method**: `POST`
- **Auth**: None (Uses signature header validation)

---

## 🧾 Wallet Transactions Log

### 1. List User Wallet Transactions
Retrieves a paginated ledger of debits, top-ups, refunds, and driver payouts for the authenticated profile.
- **URL**: `/api/v1/wallet/transactions`
- **Method**: `GET`
- **Auth**: Required
- **Query Parameters**:
  - `page`: Page index (default: `1`)
  - `limit`: Number of entries per page (default: `20`)
- **Response Example (200 OK)**:
```json
{
  "status": "success",
  "message": "Wallet transactions fetched successfully",
  "data": {
    "docs": [
      {
        "_id": "60d5ecb31f24f5a4a4f8e930",
        "user": "60d5ecb31f24f5a4a4f8e910",
        "wallet": "60d5ecb31f24f5a4a4f8e920",
        "amount": 250.00,
        "type": "debit",
        "category": "ride_payment",
        "status": "success",
        "referenceId": "60d5ecb31f24f5a4a4f8e901",
        "description": "Debit for Ride payment #RID1004",
        "createdAt": "2026-05-18T08:30:00.000Z"
      }
    ],
    "totalDocs": 45,
    "limit": 20,
    "totalPages": 3,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  }
}
```
