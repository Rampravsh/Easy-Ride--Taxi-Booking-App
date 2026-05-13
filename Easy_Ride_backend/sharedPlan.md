The `shared/` folder is one of the most important parts of a scalable backend architecture.

Its purpose is:

> Store reusable code that is used across multiple modules.

Without a proper `shared/` folder, your backend quickly becomes:

* duplicated
* inconsistent
* difficult to maintain
* hard to scale

---

# What Goes Inside `shared/`

Your `shared/` folder should contain:

```txt id="vgb9l4"
shared/
│
├── constants/
├── enums/
├── helpers/
├── interfaces/
├── types/
├── utils/
├── validators/
├── responses/
└── errors/
```

---

# 1. `shared/constants/`

Contains application-wide constant values.

## Examples

```txt id="f0hsmf"
ride.constants.ts
payment.constants.ts
socket.constants.ts
redis.constants.ts
```

---

# Example

# `shared/constants/ride.constants.ts`

```ts id="p0rqtw"
export const MAX_RIDE_RADIUS = 5000

export const DRIVER_SEARCH_TIMEOUT = 30000

export const DEFAULT_SURGE_MULTIPLIER = 1
```

---

# Why Important?

Instead of:

```ts id="fp07ij"
if (distance > 5000)
```

Use:

```ts id="w6i5z4"
if (distance > MAX_RIDE_RADIUS)
```

Benefits:

* cleaner code
* easier updates
* centralized config

---

# 2. `shared/enums/`

Stores reusable enums.

This folder becomes heavily used.

---

# Example Files

```txt id="s4jsgj"
userRole.enum.ts
rideStatus.enum.ts
paymentStatus.enum.ts
vehicleType.enum.ts
```

---

# Example

# `shared/enums/rideStatus.enum.ts`

```ts id="0a40oo"
export enum RideStatus {
  SEARCHING = 'searching',

  ACCEPTED = 'accepted',

  ARRIVING = 'arriving',

  STARTED = 'started',

  COMPLETED = 'completed',

  CANCELLED = 'cancelled'
}
```

---

# Why Use Enums?

Instead of:

```ts id="gxpdvs"
status === 'started'
```

Use:

```ts id="b9f4nm"
status === RideStatus.STARTED
```

Benefits:

* autocomplete
* typo prevention
* consistency
* safer refactoring

---

# 3. `shared/interfaces/`

Stores reusable TypeScript interfaces.

Used across modules.

---

# Example Files

```txt id="1yn4mw"
apiResponse.interface.ts
pagination.interface.ts
jwtPayload.interface.ts
socket.interface.ts
```

---

# Example

# `shared/interfaces/apiResponse.interface.ts`

```ts id="6mxg5n"
export interface ApiResponse<T> {
  success: boolean

  message: string

  data?: T

  error?: any
}
```

---

# 4. `shared/types/`

Stores reusable TypeScript types.

---

# Example Files

```txt id="20b9zj"
express.types.ts
mongoose.types.ts
global.types.ts
```

---

# Example

# `shared/types/express.types.ts`

```ts id="p7cimz"
import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: any
}
```

This becomes extremely important for auth middleware.

---

# 5. `shared/helpers/`

Contains small reusable helper functions.

Helpers should:

* stay simple
* stay pure
* avoid business logic

---

# Example Files

```txt id="jlwmqi"
distance.helper.ts
otp.helper.ts
fare.helper.ts
date.helper.ts
```

---

# Example

# `shared/helpers/fare.helper.ts`

```ts id="kdc5hu"
export const calculateFare = (
  distance: number,
  surge: number
) => {
  return distance * 10 * surge
}
```

---

# DO NOT PUT HUGE LOGIC HERE

Bad:

```txt id="gz2v4y"
bookRide.helper.ts
```

That belongs in services.

---

# 6. `shared/utils/`

Contains reusable utility functions.

Difference:

| helpers                | utils             |
| ---------------------- | ----------------- |
| small business helpers | generic utilities |

---

# Example Files

```txt id="84onkl"
logger.ts
generateId.ts
apiResponse.ts
asyncHandler.ts
```

---

# VERY IMPORTANT FILE

# `shared/utils/asyncHandler.ts`

This removes repeated try/catch blocks.

```ts id="z4xbgc"
import { Request, Response, NextFunction } from 'express'

export const asyncHandler =
  (fn: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
```

---

# Example Usage

Instead of:

```ts id="9j7ww6"
try {
} catch (error) {
}
```

Use:

```ts id="76h7h2"
router.get(
  '/',
  asyncHandler(controllerFunction)
)
```

Huge improvement.

---

# 7. `shared/validators/`

Contains reusable validation schemas.

---

# Example Files

```txt id="w9zcgb"
mongoId.validator.ts
pagination.validator.ts
geo.validator.ts
```

---

# Example

# `shared/validators/mongoId.validator.ts`

```ts id="7kjswz"
import { z } from 'zod'

export const mongoIdSchema = z.string().length(24)
```

---

# 8. `shared/responses/`

Contains reusable API response creators.

---

# Example Files

```txt id="zt90sr"
success.response.ts
error.response.ts
pagination.response.ts
```

---

# Example

```ts id="uhb0u3"
export const successResponse = (
  res: any,
  data: any,
  message = 'Success'
) => {
  return res.status(200).json({
    success: true,
    message,
    data
  })
}
```

---

# 9. `shared/errors/`

Centralized custom error classes.

This becomes VERY important later.

---

# Example Files

```txt id="8zj2g4"
ApiError.ts
ValidationError.ts
NotFoundError.ts
UnauthorizedError.ts
```

---

# Example

# `shared/errors/ApiError.ts`

```ts id="25v0q8"
export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
  }
}
```

---

# MOST IMPORTANT RULE

# `shared/` MUST NOT CONTAIN BUSINESS LOGIC

Bad:

```txt id="qqvbtl"
shared/bookRide.ts
shared/createPayment.ts
```

Business logic belongs inside:

```txt id="lj6yit"
modules/ride/ride.service.ts
modules/payment/payment.service.ts
```

---

# What SHOULD Be Shared?

Good shared code:

✅ reusable
✅ generic
✅ cross-module
✅ stateless

---

# Real Examples From Your Ride App

# Shared Candidates

## Good

```txt id="lj0j7r"
calculateDistance()
generateOTP()
calculateSurge()
sendPushNotification()
formatCurrency()
```

---

# NOT Shared

## Bad

```txt id="20i3nd"
assignDriverToRide()
completeRidePayment()
startPoolRide()
```

These are module-specific business operations.

---

# Shared Folder Will Grow MASSIVELY

In large systems, shared becomes foundational.

Especially:

* enums
* utils
* errors
* validators
* constants

You will use them everywhere.

---

# Recommended First Files In Shared

Create these first:

```txt id="4zzc7r"
shared/
│
├── enums/
│   ├── userRole.enum.ts
│   ├── rideStatus.enum.ts
│   └── paymentStatus.enum.ts
│
├── utils/
│   ├── asyncHandler.ts
│   ├── apiResponse.ts
│   └── logger.ts
│
├── errors/
│   └── ApiError.ts
│
├── validators/
│   └── mongoId.validator.ts
│
└── constants/
    └── ride.constants.ts
```

---

# Engineering Recommendation

The biggest mistake beginners make:

❌ putting random code into shared

The second biggest mistake:

❌ not using shared at all

Use it carefully and intentionally.
