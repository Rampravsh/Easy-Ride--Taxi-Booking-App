# Troubleshooting Guide

Common issues encountered during development and deployment, and how to resolve them.

---

## ⚡ Redis Connection Issues

### **Symptom**: `Error: Redis connection to 127.0.0.1:6379 failed`
- **Cause**: Redis server is not running or the host/port in `.env` is incorrect.
- **Solution**:
  1. Verify Redis status: `redis-cli ping` (should return `PONG`).
  2. Check if your Docker container is running: `docker ps`.
  3. Ensure `REDIS_HOST` in `.env` matches your setup.

---

## 📡 Socket Reconnection Loops

### **Symptom**: Client connects and immediately disconnects.
- **Cause**: 
  1. Auth middleware failing (Invalid Token).
  2. Missing CORS configuration for the client origin.
- **Solution**:
  1. Check backend logs for `Socket Auth Failed`.
  2. Verify that `CORS_ORIGIN` in `.env` includes the client URL.
  3. Ensure the client is sending the token in the `auth` object, not headers.

---

## ⛓️ BullMQ Worker Crashes

### **Symptom**: Jobs are stuck in 'active' or 'waiting' forever.
- **Cause**:
  1. Redis is out of memory.
  2. The worker process crashed without a graceful shutdown.
- **Solution**:
  1. Check Redis memory usage: `redis-cli info memory`.
  2. Check BullBoard (`/admin/queues`) to see the error stack trace for failed jobs.
  3. Ensure the worker is properly instantiated in `server.ts`.

---

## 🛡️ Firebase Verification Failures

### **Symptom**: `401 Unauthorized` even with a valid token.
- **Cause**: 
  1. Clock skew between server and Firebase.
  2. Service account JSON is invalid or has insufficient permissions.
- **Solution**:
  1. Sync your server time: `sudo ntpdate pool.ntp.org`.
  2. Re-download the service account JSON from Firebase Console.

---

## 💳 Razorpay Webhook Failures

### **Symptom**: Payments are successful in Razorpay but not updated in our database.
- **Cause**: 
  1. Webhook signature verification failing.
  2. The webhook URL is not public (local dev issue).
- **Solution**:
  1. Use **ngrok** to expose your local server: `ngrok http 5000`.
  2. Ensure `RAZORPAY_WEBHOOK_SECRET` matches the one set in the Razorpay Dashboard.
  3. Check `analyticsQueue` logs for webhook processing errors.
