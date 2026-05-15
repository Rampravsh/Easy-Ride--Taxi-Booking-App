# Payments & Wallets API

Easy Ride supports a multi-modal payment system including Wallet, Cash, and Online payments via Razorpay.

## 💳 Wallet Management

### 1. Get Wallet Balance
- **URL**: `/api/v1/wallet/balance`
- **Method**: `GET`
- **Auth**: Required

### 2. Top-up Wallet (Create Order)
Initiate a Razorpay order to add funds to the wallet.
- **URL**: `/api/v1/wallet/topup`
- **Method**: `POST`
- **Body**: `{ "amount": 500 }`

### 3. Verify Payment
Verify the Razorpay payment signature and update the wallet balance.
- **URL**: `/api/v1/wallet/verify`
- **Method**: `POST`
- **Body**:
```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "..."
}
```

---

## 🧾 Transaction History

### 1. List Transactions
Get a paginated list of all debits and credits.
- **URL**: `/api/v1/transactions`
- **Method**: `GET`

---

## 🏦 Payment Lifecycle

### Ride Payment (Automatic)
1. Ride completes.
2. `PaymentService` checks selected method.
3. If `wallet`, funds are deducted instantly.
4. If `online`, user receives a payment request notification.
5. If `cash`, rider confirms receipt of cash via `/complete` endpoint.

---

## 🛡️ Refund Policy
Refunds are processed asynchronously via the `paymentQueue`.
- **Full Refund**: If rider cancels after user has paid.
- **Partial Refund**: Cancellation after trip start (based on distance).
- **No Refund**: User no-show.
