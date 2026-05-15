# Monitoring & Observability

Easy Ride uses a multi-layered approach to ensure high availability and performance visibility.

## 📊 Metrics (Prometheus & Grafana)

We export metrics via the `/metrics` endpoint for Prometheus scraping.

### Key Performance Indicators (KPIs)
- **API Latency**: Average time per endpoint.
- **Error Rate**: Percentage of 4xx and 5xx responses.
- **Active Rides**: Current ongoing trips.
- **Queue Depth**: Number of jobs waiting in BullMQ.
- **Redis Hit Rate**: Efficiency of our caching layer.

---

## 📜 Logging (Winston & Morgan)

Logs are categorized by severity and module.

### Log Levels
- `error`: Critical failures (DB down, Payment failed).
- `warn`: Non-critical issues (Validation failure, Socket disconnect).
- `info`: Standard operational events (Ride booked, Rider online).
- `debug`: Detailed data for development troubleshooting.

### Log Rotation
In production, logs are rotated daily and kept for 14 days to prevent disk exhaustion.

---

## 🏥 Health Checks

### Liveness Probe
Ensures the app is running.
`GET /api/v1/monitoring/liveness` -> `200 OK`

### Readiness Probe
Ensures DB and Redis are connected before accepting traffic.
`GET /api/v1/monitoring/readiness` -> `200 OK` or `503 Service Unavailable`

---

## 🔔 Alerting

Alerts are triggered via **Grafana** or **Sentry** and sent to:
- **Slack**: For general system status.
- **PagerDuty**: For critical production failures.
