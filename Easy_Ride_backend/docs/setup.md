# Setup Guide

Follow these steps to get the Easy Ride backend up and running on your local machine.

## 📋 Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: v6.0 or higher (or Atlas URI)
- **Redis**: v7.0 or higher
- **Firebase Project**: Service account JSON and Project ID
- **Razorpay Account**: Key ID and Secret (for payments)
- **Twilio Account**: Account SID and Auth Token (for SMS/Calls)

---

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/easy-ride-backend.git
   cd easy-ride-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example file and fill in your credentials.
   ```bash
   cp .env.example .env
   ```
   *See [Environment Configuration](./environment.md) for details.*

4. **Firebase Setup**:
   Download your Firebase Service Account JSON and place it in `src/config/firebase-service-account.json`.

---

## 🚀 Running the App

### Development Mode
Runs the server with `ts-node-dev` for auto-reloading.
```bash
npm run dev
```

### Production Build
Compiles TypeScript to JavaScript and runs the production bundle.
```bash
npm run build
npm start
```

---

## 🧪 Verification
Once the server is running, you can verify it by hitting the health check endpoint:
```bash
curl http://localhost:5000/api/v1/
```
**Response**:
```json
{
  "status": "success",
  "message": "Welcome to Easy Ride API v1"
}
```

---

## 📦 Docker Setup (Optional)
```bash
docker-compose up --build
```
This will spin up the Node.js app, MongoDB, and Redis in isolated containers.
