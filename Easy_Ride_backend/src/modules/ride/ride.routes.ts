import { Router } from 'express';
import { RideController } from './ride.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { UserRole } from '../../shared/enums';
import { 
  estimateFareSchema, 
  bookRideSchema, 
  acceptRideSchema, 
  cancelRideSchema, 
  rideIdParamSchema 
} from './ride.validation';

const router = Router();

// All ride routes are protected
router.use(protect);

/**
 * @route   POST /api/v1/rides/estimate
 * @desc    Get fare estimate for a ride
 */
router.post('/estimate', validate(estimateFareSchema), RideController.estimateFare);

/**
 * @route   POST /api/v1/rides/book
 * @desc    Book a new ride (User only)
 */
router.post(
  '/book', 
  restrictTo(UserRole.USER), 
  validate(bookRideSchema), 
  RideController.bookRide
);

/**
 * @route   GET /api/v1/rides/:rideId
 * @desc    Get ride details
 */
router.get(
  '/:rideId', 
  validate(rideIdParamSchema), 
  RideController.getRideDetails
);

/**
 * @route   PUT /api/v1/rides/:rideId/accept
 * @desc    Accept a ride (Rider only)
 */
router.put(
  '/:rideId/accept', 
  restrictTo(UserRole.RIDER), 
  validate(rideIdParamSchema), 
  validate(acceptRideSchema), 
  RideController.acceptRide
);

/**
 * @route   PUT /api/v1/rides/:rideId/arrived
 * @desc    Mark as arrived at pickup (Rider only)
 */
router.put(
  '/:rideId/arrived', 
  restrictTo(UserRole.RIDER), 
  validate(rideIdParamSchema), 
  RideController.markAsArrived
);

/**
 * @route   PUT /api/v1/rides/:rideId/start
 * @desc    Start ride with OTP (Rider only)
 */
router.put(
  '/:rideId/start', 
  restrictTo(UserRole.RIDER), 
  validate(rideIdParamSchema), 
  RideController.startRide
);

/**
 * @route   PUT /api/v1/rides/:rideId/complete
 * @desc    Complete a ride (Rider only)
 */
router.put(
  '/:rideId/complete', 
  restrictTo(UserRole.RIDER), 
  validate(rideIdParamSchema), 
  RideController.completeRide
);

/**
 * @route   PUT /api/v1/rides/:rideId/cancel
 * @desc    Cancel a ride
 */
router.put(
  '/:rideId/cancel', 
  validate(rideIdParamSchema), 
  validate(cancelRideSchema), 
  RideController.cancelRide
);

export default router;
