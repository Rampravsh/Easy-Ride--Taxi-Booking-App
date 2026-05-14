import { Router } from 'express';
import { ScheduleController } from './schedule.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { createScheduleSchema } from './schedule.validation';

const router = Router();

router.use(protect);

router.post('/', validate(createScheduleSchema), ScheduleController.create);
router.get('/', ScheduleController.getSchedules);
router.put('/:id/cancel', ScheduleController.cancel);

export default router;
