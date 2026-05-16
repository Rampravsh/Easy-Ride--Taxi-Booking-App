import { Request } from 'express';
import { IUser } from '../../modules/user/user.model';
import { AdminRole } from '../enums';

/**
 * Extended Express Request with authenticated user context.
 *
 * `user`      — populated by `protect` middleware (Firebase token → DB lookup)
 * `adminRole` — populated by `authorizeAdminScopes` middleware for fine-grained admin RBAC
 */
export interface AuthRequest extends Request {
  user?: IUser;
  adminRole?: AdminRole;
}
