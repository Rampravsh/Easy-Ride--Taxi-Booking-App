import { Router } from 'express';
import { UserController } from './user.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { 
  updateProfileSchema, 
  saveAddressSchema, 
  updateDeviceTokenSchema, 
  updatePreferencesSchema 
} from './user.validation';
import { uploadSingleImage } from '../../middlewares/upload.middleware';

const router = Router();

// All user routes are protected
router.use(protect);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 */
router.get('/profile', UserController.getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 */
router.put('/profile', validate(updateProfileSchema), UserController.updateProfile);

/**
 * @route   POST /api/v1/users/profile-image
 * @desc    Upload profile image
 */
router.post('/profile-image', uploadSingleImage('image'), UserController.uploadProfileImage);

/**
 * @route   POST /api/v1/users/address
 * @desc    Add a saved address
 */
router.post('/address', validate(saveAddressSchema), UserController.addAddress);

/**
 * @route   DELETE /api/v1/users/address/:id
 * @desc    Delete a saved address
 */
router.delete('/address/:id', UserController.deleteAddress);

/**
 * @route   PUT /api/v1/users/device-token
 * @desc    Update device token
 */
router.put('/device-token', validate(updateDeviceTokenSchema), UserController.updateDeviceToken);

/**
 * @route   GET /api/v1/users/preferences
 * @desc    Get user preferences
 */
router.get('/preferences', UserController.getPreferences);

/**
 * @route   PUT /api/v1/users/preferences
 * @desc    Update user preferences
 */
router.put('/preferences', validate(updatePreferencesSchema), UserController.updatePreferences);

export default router;
