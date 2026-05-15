# Redis Architecture

Redis is a critical component of Easy Ride, serving as a cache, a geospatial index, and the backbone for real-time scaling.

## 🗄️ Key Structure & Namespaces

We follow a strict colon-delimited naming convention: `easyride:{module}:{key}`.

| Namespace | Key Format | Description | TTL |
|---|---|---|---|
| **Session** | `session:{userId}` | Maps userId to socketId and status | 24h |
| **Location** | `rider:locations` | **GEOSET** of all online rider coordinates | - |
| **Caching** | `cache:ride:{id}` | Cached ride details for fast lookup | 5m |
| **Matching** | `matching:{rideId}` | Stores riders who already rejected a ride | 10m |
| **Rate Limit** | `rl:{ip}` | API rate limiting counters | 1h |

---

## 📍 Geospatial Indexing
We use Redis **GEO** commands for rider matching:
1. `GEOADD rider:locations longitude latitude riderId`: Update rider position.
2. `GEORADIUS rider:locations lon lat 5 km`: Find riders within 5km.

---

## 📡 Pub/Sub & Horizontal Scaling
To support multiple backend instances:
- **Socket.IO Redis Adapter**: Synchronizes events across nodes.
- **Inter-Service Events**: Used for lightweight notifications between modules without using BullMQ.

---

## ⚡ Caching Strategy
- **Write-Through**: Updates to critical entities (User profile, Wallet balance) invalidate the Redis cache immediately.
- **Read-Aside**: Controllers check Redis before querying MongoDB.

---

## 🛡️ Persistence & Reliability
- **AOF (Append Only File)**: Enabled for transaction logs and wallet-related data.
- **Snapshotting**: Periodic RDB snapshots for disaster recovery.
- **MaxMemory Policy**: `allkeys-lru` to ensure the most active sessions are preserved.
