import { Response, NextFunction } from 'express';
import { UserRole } from '../shared/enums';
import { ApiError } from '../shared/errors/ApiError';
import { AuthRequest } from '../shared/types/express.types';

/**
 * Restrict access to specific roles
 * @param roles Array of allowed roles
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Check if user exists on request (should be populated by protect middleware)
    if (!req.user) {
      return next(new ApiError('User not found on request. Auth middleware may be missing.', 500));
    }

    // 2. Check if user role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }

    next();
  };
};
