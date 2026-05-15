# Advanced Features API

Documentation for Pooling, Scheduling, and Promo Systems.

## 🤝 Ride Pooling
- **Check Availability**: `GET /api/v1/pool/available`
- **Join Pool**: `POST /api/v1/pool/join`
- Uses smart matching to group users on similar routes.

## 📅 Scheduled Rides
- **Schedule Ride**: `POST /api/v1/schedules`
- **List My Schedules**: `GET /api/v1/schedules/me`
- Activated by a cron job 15 minutes before pickup.

## 🎟️ Promo System
- **Apply Promo**: `POST /api/v1/promos/apply`
- **List Valid Promos**: `GET /api/v1/promos/active`
