# Communication API

Documentation for Chat, Calling, and Notifications.

## 💬 In-App Chat
- **Send Message**: `POST /api/v1/chat/send`
- **Get History**: `GET /api/v1/chat/:rideId`
- **Typing Indicator**: Handled via Socket events (`chat:typing`).

## 📞 Calling (Twilio)
- **Initiate Call**: `POST /api/v1/calls/initiate`
- **Twilio Callback**: `POST /api/v1/calls/callback` (Webhook)
- Supports number masking to protect privacy.

## 🔔 Notifications (FCM)
- **Register Device**: `POST /api/v1/notifications/register`
- **List Notifications**: `GET /api/v1/notifications`
- Sent asynchronously via `notificationQueue`.
