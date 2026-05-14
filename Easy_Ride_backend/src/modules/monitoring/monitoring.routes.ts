import { Router } from 'express';
import { MonitoringController } from './monitoring.controller';

const router = Router();

router.get('/health', MonitoringController.healthCheck);
router.get('/metrics', MonitoringController.getMetrics);

export default router;
