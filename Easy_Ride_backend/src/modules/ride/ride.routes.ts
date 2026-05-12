import { Router } from 'express';
import * as rideController from './ride.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import { UserRole } from '../../shared/enums';

const router = Router();

router.use(protect);

router.post('/request', rideController.requestRide);
router.patch('/:id/accept', restrictTo(UserRole.RIDER, UserRole.ADMIN), rideController.acceptRide);
router.patch('/:id/start', restrictTo(UserRole.RIDER, UserRole.ADMIN), rideController.startRide);
router.patch('/:id/complete', restrictTo(UserRole.RIDER, UserRole.ADMIN), rideController.completeRide);

export default router;
