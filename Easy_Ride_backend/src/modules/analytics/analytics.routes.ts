import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/rbac.middleware';
import { UserRole } from '../../shared/enums';

const router = Router();

router.use(protect);
router.use(authorizeRoles(UserRole.ADMIN));

router.get('/overview', AnalyticsController.getOverview);
router.get('/revenue', AnalyticsController.getRevenue);

export default router;
