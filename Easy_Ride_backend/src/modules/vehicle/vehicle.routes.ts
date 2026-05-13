import { Router } from 'express';
import { VehicleController } from './vehicle.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validation.middleware';
import { UserRole } from '../../shared/enums';
import { 
  createVehicleSchema, 
  updateVehicleSchema, 
  updateVehicleStatusSchema, 
  verifyVehicleSchema 
} from './vehicle.validation';

const router = Router();

// All vehicle routes are protected
router.use(protect);

/**
 * @route   POST /api/v1/vehicles
 * @desc    Register a new vehicle (Riders only)
 */
router.post(
  '/', 
  restrictTo(UserRole.RIDER), 
  validate(createVehicleSchema), 
  VehicleController.registerVehicle
);

/**
 * @route   GET /api/v1/vehicles/my-vehicles
 * @desc    Get all vehicles for current rider
 */
router.get(
  '/my-vehicles', 
  restrictTo(UserRole.RIDER), 
  VehicleController.getMyVehicles
);

/**
 * @route   GET /api/v1/vehicles/:vehicleId
 * @desc    Get vehicle details
 */
router.get(
  '/:vehicleId', 
  VehicleController.getVehicleDetails
);

/**
 * @route   PUT /api/v1/vehicles/:vehicleId
 * @desc    Update vehicle details
 */
router.put(
  '/:vehicleId', 
  restrictTo(UserRole.RIDER), 
  validate(updateVehicleSchema), 
  VehicleController.updateVehicle
);

/**
 * @route   DELETE /api/v1/vehicles/:vehicleId
 * @desc    Delete a vehicle
 */
router.delete(
  '/:vehicleId', 
  restrictTo(UserRole.RIDER), 
  VehicleController.deleteVehicle
);

/**
 * @route   PUT /api/v1/vehicles/:vehicleId/status
 * @desc    Toggle vehicle active status
 */
router.put(
  '/:vehicleId/status', 
  restrictTo(UserRole.RIDER), 
  validate(updateVehicleStatusSchema), 
  VehicleController.updateStatus
);

/**
 * @route   PUT /api/v1/vehicles/:vehicleId/verify
 * @desc    Verify vehicle (Admin only)
 */
router.put(
  '/:vehicleId/verify', 
  restrictTo(UserRole.ADMIN), 
  validate(verifyVehicleSchema), 
  VehicleController.verifyVehicle
);

export default router;
