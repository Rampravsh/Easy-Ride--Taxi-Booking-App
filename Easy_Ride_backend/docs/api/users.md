# Users & Riders API

Manage profiles for both users (passengers) and riders (drivers).

## 👤 User Profile

### 1. Get Profile
- **URL**: `/api/v1/users/me`
- **Method**: `GET`
- **Auth**: Required

### 2. Update Profile
- **URL**: `/api/v1/users/me`
- **Method**: `PATCH`
- **Body**: `{ "name": "Jane Doe", "email": "jane@example.com" }`

---

## 🏍️ Rider Management

### 1. Register as Rider
Submit vehicle and license details for verification.
- **URL**: `/api/v1/riders/register`
- **Method**: `POST`
- **Body**:
```json
{
  "licenseNumber": "ABC12345",
  "vehicle": {
    "type": "car",
    "model": "Toyota Camry",
    "plateNumber": "XYZ-987"
  }
}
```

### 2. Update Online Status
- **URL**: `/api/v1/riders/status`
- **Method**: `PATCH`
- **Body**: `{ "isOnline": true }`

---

## 🚗 Vehicle Management

### 1. Add Vehicle
- **URL**: `/api/v1/vehicles`
- **Method**: `POST`

### 2. List My Vehicles
- **URL**: `/api/v1/vehicles/me`
- **Method**: `GET`
