# Communication API Reference

Handles in-app passenger/driver messaging, mask phone calls, and Firebase Cloud Messaging (FCM) notifications.

---

## 💬 In-App Chat

Trip messages are bound to a specific active ride record.

### 1. Send Message
Sends a text, image, audio, or location message.
- **URL**: `/api/v1/chat/send`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "rideId": "60d5ecb31f24f5a4a4f8e901",
  "receiverId": "60d5ecb31f24f5a4a4f8e910",
  "message": "I have arrived at the designated gate.",
  "messageType": "text"
}
```

### 2. Get Messages History
Retrieves full chat logs for a specific ride context.
- **URL**: `/api/v1/chat/:rideId/messages`
- **Method**: `GET`
- **Auth**: Required

### 3. Mark Messages as Read
- **URL**: `/api/v1/chat/:rideId/read`
- **Method**: `PUT`

### 4. Unread Messages Count
- **URL**: `/api/v1/chat/unread-count`
- **Method**: `GET`

---

## 📞 Masked VoIP Calling (Twilio integration)

Protects telephone identities of both parties using Twilio call proxying.

### 1. Initiate Proxy Call
- **URL**: `/api/v1/calls/initiate`
- **Method**: `POST`
- **Body**: `{ "rideId": "60d5ecb31f24f5a4a4f8e901" }`

### 2. Accept Call
- **URL**: `/api/v1/calls/:callId/accept`
- **Method**: `POST`

### 3. End Call
- **URL**: `/api/v1/calls/:callId/end`
- **Method**: `POST`

### 4. Get Call History
- **URL**: `/api/v1/calls/history`
- **Method**: `GET`

---

## 🔔 Firebase Push Notifications

Asynchronous background dispatch via `notificationQueue`.

### 1. Register Device FCM Token
Registers/binds a mobile device token for direct notifications push.
- **URL**: `/api/v1/notifications/register-token`
- **Method**: `POST`
- **Body**: `{ "token": "fcm_token_string..." }`

### 2. Remove Device FCM Token
Clears token on user logout.
- **URL**: `/api/v1/notifications/remove-token`
- **Method**: `POST`
- **Body**: `{ "token": "fcm_token_string..." }`

### 3. List Notification History
- **URL**: `/api/v1/notifications`
- **Method**: `GET`

### 4. Mark Notification as Read
- **URL**: `/api/v1/notifications/:id/read`
- **Method**: `PUT`
