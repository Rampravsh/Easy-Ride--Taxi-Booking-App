# Ride Management API

Handle ride estimations, bookings, and lifecycle transitions.

## 🚠 Ride Lifecycle Summary
1. `POST /estimate`: User gets price.
2. `POST /book`: User requests a ride.
3. `PUT /:id/accept`: Rider accepts the request.
4. `PUT /:id/arrived`: Rider arrives at pickup.
5. `PUT /:id/start`: Rider starts the ride (using OTP).
6. `PUT /:id/complete`: Rider completes the ride.
7. `PUT /:id/cancel`: User/Rider cancels the ride.

---

## 1. Estimate Fare
Get price estimates for different vehicle types.

- **URL**: `/api/v1/rides/estimate`
- **Method**: `POST`
- **Auth**: Required
- **Permissions**: All

### Request Body
```json
{
  "pickupCoordinates": [longitude, latitude],
  "dropCoordinates": [longitude, latitude],
  "rideType": "car",
  "rideCategory": "economy"
}
```

### Response
```json
{
  "status": "success",
  "data": {
    "estimates": [
      {
        "type": "car",
        "category": "economy",
        "fare": 250.50,
        "distance": 5.2,
        "duration": 15
      }
    ]
  }
}
```

---

## 2. Book a Ride
Initiate a ride request.

- **URL**: `/api/v1/rides/book`
- **Method**: `POST`
- **Auth**: Required
- **Permissions**: `user` only

### Request Body
```json
{
  "pickupCoordinates": [longitude, latitude],
  "dropCoordinates": [longitude, latitude],
  "pickupAddress": "123 Main St, Tech City",
  "dropAddress": "456 Office Pkwy, Tech City",
  "rideType": "car",
  "rideCategory": "economy",
  "paymentMethod": "wallet"
}
```

---

## 3. Accept Ride
Accept a pending ride request.

- **URL**: `/api/v1/rides/:rideId/accept`
- **Method**: `PUT`
- **Auth**: Required
- **Permissions**: `rider` only

### Request Body
```json
{
  "vehicleId": "60d5ecb31f24f5a4a4f8e912"
}
```

---

## 4. Start Ride
Start the ride journey. Requires OTP verification.

- **URL**: `/api/v1/rides/:rideId/start`
- **Method**: `PUT`
- **Auth**: Required
- **Permissions**: `rider` only

### Request Body
```json
{
  "otp": "1234"
}
```

---

## 5. Cancel Ride
Cancel an active or pending ride.

- **URL**: `/api/v1/rides/:rideId/cancel`
- **Method**: `PUT`
- **Auth**: Required

### Request Body
```json
{
  "reason": "Changed my mind"
}
```

---

## Error Codes
| Status Code | Error Message | Description |
|---|---|---|
| 400 | Invalid Ride ID | The provided rideId is not a valid MongoDB ObjectId |
| 403 | Insufficient Wallet Balance | User does not have enough funds to book |
| 404 | Ride Not Found | No ride exists with the given ID |
| 409 | Ride Already Accepted | Another rider has already accepted this request |
