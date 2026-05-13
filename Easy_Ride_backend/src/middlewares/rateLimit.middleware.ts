import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../shared/utils/apiResponse';

/**
 * General API Rate Limiter
 * Limits requests to 100 per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  handler: (req, res, next, options) => {
    ApiResponse.error(res, options.message.message, 429);
  },
});

/**
 * Auth Rate Limiter
 * Stricter limit for authentication routes to prevent brute-force attacks
 * Limits requests to 10 per hour per IP
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP, please try again after an hour',
  },
  handler: (req, res, next, options) => {
    ApiResponse.error(res, options.message.message, 429);
  },
});
