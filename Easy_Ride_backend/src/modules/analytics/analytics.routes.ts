import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorizeRoles, authorizeAdminScopes } from '../../middlewares/rbac.middleware';
import { UserRole, AdminRole } from '../../shared/enums';
import { validate } from '../../middlewares/validation.middleware';
import { getRevenueSchema } from './analytics.validation';

const router = Router();

router.use(protect);
router.use(authorizeRoles(UserRole.ADMIN));

/**
 * @route   GET /api/v1/analytics/overview
 * @desc    Real-time operations overview
 * @access  SUPER_ADMIN, ANALYTICS_ADMIN, OPERATIONS_ADMIN
 */
router.get(
  '/overview',
  authorizeAdminScopes(
    AdminRole.SUPER_ADMIN,
    AdminRole.ANALYTICS_ADMIN,
    AdminRole.OPERATIONS_ADMIN
  ),
  AnalyticsController.getOverview
);

/**
 * @route   GET /api/v1/analytics/revenue
 * @desc    Revenue metrics for a date range
 * @access  SUPER_ADMIN, ANALYTICS_ADMIN, FINANCE_ADMIN
 */
router.get(
  '/revenue',
  authorizeAdminScopes(
    AdminRole.SUPER_ADMIN,
    AdminRole.ANALYTICS_ADMIN,
    AdminRole.FINANCE_ADMIN
  ),
  validate(getRevenueSchema),
  AnalyticsController.getRevenue
);

export default router;

