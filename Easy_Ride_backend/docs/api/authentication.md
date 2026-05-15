# Authentication API

Easy Ride uses **Firebase Authentication** as the primary identity provider. The backend verifies Firebase ID tokens and maps them to internal user/rider profiles.

## 🔑 Authentication Flow
1. Client authenticates with Firebase (Phone, Email, Google, etc.).
2. Client receives a `Firebase ID Token`.
3. Client sends the token to `/api/v1/auth/firebase`.
4. Backend verifies the token using `firebase-admin`.
5. Backend creates/updates the user profile in MongoDB.
6. Backend returns the user profile and a session cookie (if configured).

---

## 1. Firebase Login / Register
Authenticate a user or rider using their Firebase token.

- **URL**: `/api/v1/auth/firebase`
- **Method**: `POST`
- **Auth**: Public

### Request Body
```json
{
  "token": "FIREBASE_ID_TOKEN_STRING",
  "role": "user" // Or "rider" or "admin"
}
```

### Response
```json
{
  "status": "success",
  "message": "Authentication successful",
  "data": {
    "_id": "60d5ecb31f24f5a4a4f8e912",
    "uid": "firebase_uid_123",
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "role": "user",
    "isVerified": true
  }
}
```

---

## 🛡️ Role-Based Access Control (RBAC)
The system supports three primary roles:
- `user`: Can book rides, manage wallet, and view history.
- `rider`: Can accept rides, update location, and manage vehicle.
- `admin`: Full access to the dashboard and management tools.

### Route Protection Middleware
- `protect`: Ensures the request has a valid session/token.
- `restrictTo(...roles)`: Limits access to specific roles.

```typescript
router.post('/book', protect, restrictTo('user'), RideController.bookRide);
```

---

## Error Codes
| Status Code | Error Message | Description |
|---|---|---|
| 401 | Invalid Firebase Token | The provided token could not be verified by Firebase Admin SDK. |
| 401 | User Account Disabled | The user account has been deactivated. |
| 403 | Invalid Role | The requested role does not match the account type. |
