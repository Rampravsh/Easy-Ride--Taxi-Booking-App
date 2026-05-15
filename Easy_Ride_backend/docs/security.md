# Security Documentation

Easy Ride is designed with multiple layers of security to protect user data and ensure platform integrity.

## 🔐 Identity & Access

### 1. Firebase Authentication
- Primary auth provider for Users and Riders.
- Backend verifies `Firebase ID Tokens` on every request.
- No passwords stored in our database.

### 2. Role-Based Access Control (RBAC)
- Strict middleware enforcement for `user`, `rider`, and `admin` roles.
- `restrictTo` middleware checks the `role` field in the user document.

---

## 🛡️ Infrastructure Security

### 1. Secure Headers (Helmet)
We use `helmet` to set various HTTP headers for security:
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`

### 2. Rate Limiting
- **Global API Rate Limit**: 100 requests per 15 minutes per IP.
- **Auth Rate Limit**: 5 attempts per 10 minutes for sensitive endpoints.
- Implemented using `express-rate-limit` with Redis store.

### 3. Data Sanitization
- Protection against NoSQL Injection using `express-mongo-sanitize`.
- XSS Protection via custom middleware and input encoding.

---

## 🚦 Transactional Security

### 1. Idempotency
- Payment and Wallet operations use an `idempotency-key` (usually `transactionId` or `orderId`) to prevent duplicate processing.

### 2. Webhook Validation
- Razorpay and Twilio webhooks are validated using HMAC signatures to ensure they originate from the correct provider.

### 3. Fraud Detection
- **GPS Spoofing**: Detection algorithms check for impossible travel speeds.
- **Multiple Accounts**: Device ID fingerprinting to identify multi-account abuse.
- **Promo Abuse**: Per-user and per-device limits on promo code usage.

---

## 📦 Environment & Secrets
- All secrets are stored in `.env` (not committed to VCS).
- Production secrets are managed via **HashiCorp Vault** or Cloud Secret Managers.
