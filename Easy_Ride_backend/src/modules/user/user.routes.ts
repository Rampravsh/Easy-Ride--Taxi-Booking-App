import { Router } from 'express';
import * as userController from './user.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);
router.get('/:id', userController.getUserById);

export default router;
