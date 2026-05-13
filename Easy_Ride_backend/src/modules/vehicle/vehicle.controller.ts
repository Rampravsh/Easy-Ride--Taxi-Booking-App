import { Response } from 'express';
import { VehicleService } from './vehicle.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import { VerificationStatus } from '../rider/rider.interface';

const vehicleService = new VehicleService();

export class VehicleController {
  /**
   * Register a new vehicle
   */
  static registerVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const vehicle = await vehicleService.registerVehicle(riderId, req.body);
    
    return ApiResponse.success(res, 'Vehicle registered successfully', vehicle, 201);
  });

  /**
   * Get all vehicles for current rider
   */
  static getMyVehicles = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const vehicles = await vehicleService.getMyVehicles(riderId);
    
    return ApiResponse.success(res, 'Vehicles retrieved successfully', vehicles);
  });

  /**
   * Get vehicle details
   */
  static getVehicleDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vehicleId = req.params.vehicleId as string;
    const vehicle = await vehicleService.getVehicleDetails(vehicleId);
    
    return ApiResponse.success(res, 'Vehicle details retrieved successfully', vehicle);
  });

  /**
   * Update vehicle
   */
  static updateVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const vehicleId = req.params.vehicleId as string;
    const vehicle = await vehicleService.updateVehicle(riderId, vehicleId, req.body);
    
    return ApiResponse.success(res, 'Vehicle updated successfully', vehicle);
  });

  /**
   * Toggle vehicle status (active/inactive)
   */
  static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const vehicleId = req.params.vehicleId as string;
    const { isActive } = req.body;
    const vehicle = await vehicleService.toggleActivation(riderId, vehicleId, isActive);
    
    return ApiResponse.success(res, `Vehicle is now ${isActive ? 'active' : 'inactive'}`, vehicle);
  });

  /**
   * Verify vehicle (Admin Only)
   */
  static verifyVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vehicleId = req.params.vehicleId as string;
    const { status } = req.body;
    const vehicle = await vehicleService.verifyVehicle(vehicleId, status as VerificationStatus);
    
    return ApiResponse.success(res, `Vehicle verification status updated to ${status}`, vehicle);
  });

  /**
   * Delete vehicle
   */
  static deleteVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const vehicleId = req.params.vehicleId as string;
    await vehicleService.deleteVehicle(riderId, vehicleId);
    
    return ApiResponse.success(res, 'Vehicle deleted successfully', null);
  });
}
