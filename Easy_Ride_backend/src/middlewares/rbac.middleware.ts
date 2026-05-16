import { Response, NextFunction } from 'express';
import { AuthRequest } from '../shared/types/express.types';
import { ApiError } from '../shared/errors/ApiError';
import httpStatus from 'http-status';
import { AdminRole, UserRole } from '../shared/enums';

// ---------------------------------------------------------------------------
// authorizeRoles — General role-based access control
// ---------------------------------------------------------------------------

/**
 * Restrict access to one or more `UserRole` values.
 *
 * Usage:
 *   router.use(protect);
 *   router.use(authorizeRoles(UserRole.ADMIN));
 *
 * For rider-only or user-only routes, prefer the alias `restrictTo` exported
 * from role.middleware.ts — both call the same underlying function.
 */
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated.', httpStatus.UNAUTHORIZED));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('Access denied. Insufficient permissions.', httpStatus.FORBIDDEN)
      );
    }
    next();
  };
};

// ---------------------------------------------------------------------------
// authorizeAdminScopes — Fine-grained admin sub-role access control
// ---------------------------------------------------------------------------

/**
 * Guard admin routes by AdminRole sub-roles.
 *
 * Must be used AFTER `protect` and `authorizeRoles(UserRole.ADMIN)`.
 *
 * SUPER_ADMIN always passes — they have access to every scope.
 *
 * Usage:
 *   router.use(protect);
 *   router.use(authorizeRoles(UserRole.ADMIN));
 *   router.use(authorizeAdminScopes(AdminRole.FINANCE_ADMIN));
 *
 * The `adminRole` is read from `req.user` via the `adminRole` field on the
 * User document. The User model must expose this field (add as needed).
 */
export const authorizeAdminScopes = (...requiredRoles: AdminRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated.', httpStatus.UNAUTHORIZED));
    }

    if (req.user.role !== UserRole.ADMIN) {
      return next(
        new ApiError('Access denied. Admin role required.', httpStatus.FORBIDDEN)
      );
    }

    // Read adminRole from the user document (typed via req.adminRole which
    // should be populated by a preceding middleware or from req.user as needed).
    // Cast is safe here because we've already confirmed role === ADMIN.
    const userAdminRole = (req.user as any).adminRole as AdminRole | undefined;

    // Attach typed adminRole to request for downstream handlers
    if (userAdminRole) {
      req.adminRole = userAdminRole;
    }

    // SUPER_ADMIN bypasses all scope checks
    if (userAdminRole === AdminRole.SUPER_ADMIN) {
      return next();
    }

    if (!userAdminRole || !requiredRoles.includes(userAdminRole)) {
      return next(
        new ApiError('Access denied. Insufficient admin privileges.', httpStatus.FORBIDDEN)
      );
    }

    next();
  };
};

// ---------------------------------------------------------------------------
// requireAdminOrScopes — Convenience: allow ADMIN or specific AdminRole scopes
// ---------------------------------------------------------------------------

/**
 * Allows access if the user has UserRole.ADMIN AND any of the specified admin scopes.
 * SUPER_ADMIN always passes.
 */
export const requireAdminScopes = (...scopes: AdminRole[]) => [
  authorizeRoles(UserRole.ADMIN),
  authorizeAdminScopes(...scopes),
];
