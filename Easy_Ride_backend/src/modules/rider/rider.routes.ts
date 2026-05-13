import { Router } from 'express';
import { RiderController } from './rider.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { UserRole } from '../../shared/enums';
import { 
  updateRiderProfileSchema, 
  updateLocationSchema, 
  updateStatusSchema, 
  updateAvailabilitySchema, 
  updateDeviceTokenSchema 
} from './rider.validation';

const router = Router();

// All rider routes are protected and restricted to RIDER role
router.use(protect);
router.use(restrictTo(UserRole.RIDER));

/**
 * @route   GET /api/v1/riders/profile
 * @desc    Get current rider profile
 */
router.get('/profile', RiderController.getProfile);

/**
 * @route   PUT /api/v1/riders/profile
 * @desc    Update rider profile
 */
router.put('/profile', validate(updateRiderProfileSchema), RiderController.updateProfile);

/**
 * @route   PUT /api/v1/riders/status
 * @desc    Update online status
 */
router.put('/status', validate(updateStatusSchema), RiderController.updateStatus);

/**
 * @route   PUT /api/v1/riders/location
 * @desc    Update live location
 */
router.put('/location', validate(updateLocationSchema), RiderController.updateLocation);

/**
 * @route   PUT /api/v1/riders/availability
 * @desc    Update availability status
 */
router.put('/availability', validate(updateAvailabilitySchema), RiderController.updateAvailability);

/**
 * @route   PUT /api/v1/riders/device-token
 * @desc    Update device token
 */
router.put('/device-token', validate(updateDeviceTokenSchema), RiderController.updateDeviceToken);

/**
 * @route   GET /api/v1/riders/earnings
 * @desc    Get earnings info
 */
router.get('/earnings', RiderController.getEarnings);

/**
 * @route   GET /api/v1/riders/current-ride
 * @desc    Get current active ride
 */
router.get('/current-ride', RiderController.getCurrentRide);

export default router;
