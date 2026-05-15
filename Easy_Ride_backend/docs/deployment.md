# Deployment Guide

Easy Ride is designed to be deployed as a containerized application for maximum scalability.

## 🏗️ Production Infrastructure Recommendation

| Component | Recommendation |
|---|---|
| **App Hosting** | AWS ECS, Google Cloud Run, or Kubernetes (K8s) |
| **Database** | MongoDB Atlas (Tier M10+) |
| **Redis** | Redis Cloud or Amazon ElastiCache |
| **Workers** | Separate cluster/deployment for BullMQ workers |
| **Load Balancer** | Nginx or AWS ALB with Sticky Sessions |

---

## 📦 PM2 Setup (Process Manager)

If deploying on a VPS (Ubuntu/Debian) without Docker:

1. **Install PM2**: `npm install -g pm2`
2. **Ecosystem File** (`ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [
       {
         name: "easy-ride-api",
         script: "./dist/server.js",
         instances: "max",
         exec_mode: "cluster",
         env: { NODE_ENV: "production" }
       },
       {
         name: "easy-ride-workers",
         script: "./dist/workers.js",
         instances: 2
       }
     ]
   };
   ```
3. **Start**: `pm2 start ecosystem.config.js`

---

## 🚦 Zero-Downtime Deployment
To achieve zero-downtime:
1. Use **Blue-Green Deployment** or **Rolling Updates**.
2. Ensure MongoDB migrations are backward compatible.
3. Socket.IO clients should handle automatic reconnection.

---

## 🛡️ Scaling Considerations
- **Statelessness**: The API is fully stateless. Session data is in Redis.
- **Worker Isolation**: Large-scale deployments should run `rideQueue` and `notificationQueue` on separate machines to prevent CPU spikes from affecting API latency.
- **Database Sharding**: Enable sharding on `rides` and `transactions` collections once they exceed 100GB.
