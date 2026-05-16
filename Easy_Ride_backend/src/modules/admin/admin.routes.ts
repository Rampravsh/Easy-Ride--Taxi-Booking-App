import { Router } from 'express';
import { AdminController } from './admin.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorizeRoles, authorizeAdminScopes } from '../../middlewares/rbac.middleware';
import { UserRole, AdminRole } from '../../shared/enums';

const router = Router();

// All admin routes require authentication
router.use(protect);

// All admin routes require the ADMIN user role
router.use(authorizeRoles(UserRole.ADMIN));

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get platform-wide statistics
 * @access  Admin (all scopes)
 */
router.get('/dashboard', AdminController.getDashboardStats);

/**
 * @route   PUT /api/v1/admin/riders/:id/verify
 * @desc    Approve or reject a rider's verification
 * @access  SUPER_ADMIN, OPERATIONS_ADMIN, SUPPORT_ADMIN
 */
router.put(
  '/riders/:id/verify',
  authorizeAdminScopes(
    AdminRole.SUPER_ADMIN,
    AdminRole.OPERATIONS_ADMIN,
    AdminRole.SUPPORT_ADMIN
  ),
  AdminController.verifyRider
);

/**
 * @route   PUT /api/v1/admin/users/:id/block
 * @desc    Block or unblock a user account
 * @access  SUPER_ADMIN, SUPPORT_ADMIN
 */
router.put(
  '/users/:id/block',
  authorizeAdminScopes(AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_ADMIN),
  AdminController.blockUser
);

/**
 * @route   PUT /api/v1/admin/riders/:id/block
 * @desc    Block or unblock a rider account
 * @access  SUPER_ADMIN, SUPPORT_ADMIN
 */
router.put(
  '/riders/:id/block',
  authorizeAdminScopes(AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_ADMIN),
  AdminController.blockRider
);

/**
 * @route   POST /api/v1/admin/refunds/:transactionId
 * @desc    Manually process a refund
 * @access  SUPER_ADMIN, FINANCE_ADMIN
 */
router.post(
  '/refunds/:transactionId',
  authorizeAdminScopes(AdminRole.SUPER_ADMIN, AdminRole.FINANCE_ADMIN),
  AdminController.processRefund
);

/**
 * @route   GET /api/v1/admin/audit
 * @desc    View audit log
 * @access  SUPER_ADMIN
 */
router.get(
  '/audit',
  authorizeAdminScopes(AdminRole.SUPER_ADMIN),
  AdminController.getAuditLog
);

export default router;
