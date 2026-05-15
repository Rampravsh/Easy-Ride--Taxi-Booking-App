# Error Handling Standards

Easy Ride uses a centralized error handling mechanism to ensure consistent API responses across all modules.

## 🛑 Standard Error Response

All errors return a JSON object with the following structure:

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "errors": [], // Optional: array of validation errors
  "stack": "..." // Only in development environment
}
```

---

## 🏗️ The `ApiError` Class

We use a custom `ApiError` class extending the native `Error` object.

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public stack = ''
  ) {
    super(message);
    // ...
  }
}
```

---

## 📋 Common Status Codes

| Code | Type | Description |
|---|---|---|
| 400 | Bad Request | Validation failed or malformed request. |
| 401 | Unauthorized | Authentication token missing or invalid. |
| 403 | Forbidden | User does not have permission for this action. |
| 404 | Not Found | Resource does not exist. |
| 429 | Too Many Requests | Rate limit exceeded. |
| 500 | Internal Server Error | Unexpected server-side failure. |

---

## 🛠️ Global Middleware

The `errorMiddleware` in `src/middlewares/error.middleware.ts` catches all errors and:
1. Logs the error using Winston.
2. Formats the response based on `NODE_ENV`.
3. Handles specific errors like `MongoError` (11000 for duplicate keys) or `ZodError` (validation).

---

## 🚦 Async Error Handling

We use an `asyncHandler` wrapper to avoid `try-catch` blocks in controllers:

```typescript
export const bookRide = asyncHandler(async (req, res) => {
  const ride = await rideService.createRide(req.body);
  res.status(201).json({ status: 'success', data: ride });
});
```
