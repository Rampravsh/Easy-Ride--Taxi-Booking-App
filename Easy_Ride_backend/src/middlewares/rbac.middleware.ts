import { Response, NextFunction } from 'express';
import { AuthRequest } from '../shared/types/express.types';
import { ApiError } from '../shared/errors/ApiError';
import httpStatus from 'http-status';
import { AdminRole, UserRole } from '../shared/enums';

/**
 * Middleware to restrict access based on User Role
 */
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError('Access denied. Insufficient permissions.', httpStatus.FORBIDDEN);
    }
    next();
  };
};

/**
 * Middleware to restrict access based on Admin Scopes (Internal Admin only)
 */
export const authorizeAdminScopes = (...requiredRoles: AdminRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.ADMIN) {
      throw new ApiError('Access denied. Admin role required.', httpStatus.FORBIDDEN);
    }

    // In production, fetch specific admin permissions from an 'Admin' model or RBAC table
    // For now, we assume the user object contains an adminRole field if they are an admin
    const userAdminRole = (req.user as any).adminRole;
    
    if (userAdminRole !== AdminRole.SUPER_ADMIN && !requiredRoles.includes(userAdminRole)) {
      throw new ApiError('Access denied. Insufficient admin privileges.', httpStatus.FORBIDDEN);
    }

    next();
  };
};
