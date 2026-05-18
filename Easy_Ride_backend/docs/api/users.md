# Users & Riders API Reference

Manage passenger profiles, settings, rider registration, and vehicle assets.

---

## 👤 Passenger Profiles & Settings

All passenger endpoints require a valid Firebase ID Token passed as a Bearer token in the `Authorization` header.

### 1. Get Passenger Profile
Retrieves the complete profile metadata of the authenticated passenger.
- **URL**: `/api/v1/users/profile`
- **Method**: `GET`
- **Auth**: Required
- **Response Example (200 OK)**:
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "60d5ecb31f24f5a4a4f8e910",
    "firebaseUID": "abc123xyz",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "user",
    "walletBalance": 350.00,
    "rating": 4.8,
    "totalRides": 12,
    "savedAddresses": [
      {
        "_id": "60d5ecb31f24f5a4a4f8e911",
        "label": "Home",
        "address": "123 Main St, Tech City"
      }
    ],
    "preferences": {
      "notifications": {
        "push": true,
        "email": true,
        "sms": false
      },
      "language": "en",
      "theme": "system"
    }
  }
}
```

### 2. Update Profile Details
Updates contact details of the authenticated user profile.
- **URL**: `/api/v1/users/profile`
- **Method**: `PUT`
- **Auth**: Required
- **Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1987654321"
}
```

### 3. Upload Profile Image
Uploads an avatar image.
- **URL**: `/api/v1/users/profile-image`
- **Method**: `POST`
- **Format**: `multipart/form-data`
- **Body**: `image` (File buffer)

### 4. Saved Addresses Shortcuts
- **Add Address**:
  - **URL**: `/api/v1/users/address`
  - **Method**: `POST`
  - **Body**: `{ "label": "Work", "address": "456 Corporate Blvd", "coordinates": [77.5946, 12.9716] }`
- **Delete Address**:
  - **URL**: `/api/v1/users/address/:id`
  - **Method**: `DELETE`

### 5. Preference Configuration
- **Get Preferences**:
  - **URL**: `/api/v1/users/preferences`
  - **Method**: `GET`
- **Update Preferences**:
  - **URL**: `/api/v1/users/preferences`
  - **Method**: `PUT`
  - **Body**: `{ "theme": "dark", "notifications": { "sms": true } }`

### 6. Update FCM Token
- **URL**: `/api/v1/users/device-token`
- **Method**: `PUT`
- **Body**: `{ "token": "fcm_token_string..." }`

---

## 🏍️ Rider Onboarding & Status

Rider endpoints are dedicated to driver-specific registrations and statuses.

### 1. Register as Rider
Enables a regular user to submit driver documents for administrative verification.
- **URL**: `/api/v1/rider/register`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "licenseNumber": "DL-123456789",
  "vehicle": {
    "type": "cab",
    "category": "saver",
    "brand": "Toyota",
    "modelName": "Etios",
    "color": "Silver",
    "year": 2021,
    "numberPlate": "KA-01-AB-1234",
    "seatingCapacity": 4,
    "fuelType": "cng"
  }
}
```

### 2. Toggle Active Online Status
Changes rider dispatch availability.
- **URL**: `/api/v1/rider/status`
- **Method**: `PATCH`
- **Auth**: Required (Riders only)
- **Body**: `{ "isOnline": true }`

---

## 🚗 Vehicle Asset Management

Riders manage the list of vehicle assets they own.

### 1. Add Vehicle (Riders Only)
- **URL**: `/api/v1/vehicles`
- **Method**: `POST`
- **Body**: `{ "type": "cab", "category": "premium", "brand": "Honda", "modelName": "City", "color": "White", "year": 2022, "numberPlate": "KA-01-XY-5678", "seatingCapacity": 4, "fuelType": "petrol" }`

### 2. List Registered Vehicles (Riders Only)
- **URL**: `/api/v1/vehicles/my-vehicles`
- **Method**: `GET`

### 3. Get Vehicle Detail
- **URL**: `/api/v1/vehicles/:vehicleId`
- **Method**: `GET`

### 4. Update Vehicle (Riders Only)
- **URL**: `/api/v1/vehicles/:vehicleId`
- **Method**: `PUT`

### 5. Delete Vehicle (Riders Only)
- **URL**: `/api/v1/vehicles/:vehicleId`
- **Method**: `DELETE`

### 6. Toggle Active Vehicle selection (Riders Only)
- **URL**: `/api/v1/vehicles/:vehicleId/status`
- **Method**: `PUT`
- **Body**: `{ "isActive": true }`
