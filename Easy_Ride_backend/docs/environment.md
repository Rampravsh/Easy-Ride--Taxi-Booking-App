# Environment Configuration

The application uses `dotenv` to manage configuration. Below are the required variables for different modules.

## 🌐 Server Settings
| Variable | Description | Default |
|---|---|---|
| `PORT` | The port the server listens on | `5000` |
| `NODE_ENV` | environment (`development`, `production`, `test`) | `development` |
| `API_VERSION` | Base API version | `v1` |

## 🗄️ Database (MongoDB)
| Variable | Description |
|---|---|
| `MONGODB_URI` | Full connection string (e.g., `mongodb://localhost:27017/easyride`) |

## ⚡ Cache & Queues (Redis)
| Variable | Description |
|---|---|
| `REDIS_HOST` | Hostname of the Redis server |
| `REDIS_PORT` | Port of the Redis server |
| `REDIS_PASSWORD` | Password (if applicable) |

## 🔐 Firebase (Auth & FCM)
| Variable | Description |
|---|---|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key (replace `\n` with actual newlines) |

## 💳 Payments (Razorpay)
| Variable | Description |
|---|---|
| `RAZORPAY_KEY_ID` | Your Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay API Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Secret to validate webhooks |

## 💬 Communications (Twilio)
| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Your Twilio-provided number |

## 📈 Monitoring & Logging
| Variable | Description | Default |
|---|---|---|
| `LOG_LEVEL` | Logging verbosity (`debug`, `info`, `warn`, `error`) | `info` |
| `PROMETHEUS_PORT` | Port for metrics scraping | `9090` |
