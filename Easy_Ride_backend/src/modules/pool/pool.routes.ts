import { Router } from 'express';
import { PoolController } from './pool.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { joinPoolSchema } from './pool.validation';

const router = Router();

router.use(protect);

router.post('/join', validate(joinPoolSchema), PoolController.join);
router.post('/leave', PoolController.leave);

export default router;
