import { Response, NextFunction } from 'express';
import { UserRole } from '../shared/enums';
import { ApiError } from '../shared/errors/ApiError';

/**
 * Middleware to restrict access to specific roles.
 * @param roles - Array of roles that are allowed to access the route.
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
