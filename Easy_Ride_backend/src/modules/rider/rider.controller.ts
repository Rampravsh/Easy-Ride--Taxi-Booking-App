import { Response } from 'express';
import { RiderService } from './rider.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';

const riderService = new RiderService();

export class RiderController {
  /**
   * Get current rider profile
   */
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const profile = await riderService.getProfile(riderId);
    
    return ApiResponse.success(res, 'Rider profile retrieved successfully', profile);
  });

  /**
   * Update rider profile
   */
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const profile = await riderService.updateProfile(riderId, req.body);
    
    return ApiResponse.success(res, 'Rider profile updated successfully', profile);
  });

  /**
   * Update live location
   */
  static updateLocation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const profile = await riderService.updateLocation(riderId, req.body);
    
    return ApiResponse.success(res, 'Rider location updated successfully', profile);
  });

  /**
   * Update online status
   */
  static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const { isOnline } = req.body;
    const profile = await riderService.updateStatus(riderId, isOnline);
    
    return ApiResponse.success(res, `Rider is now ${isOnline ? 'online' : 'offline'}`, profile);
  });

  /**
   * Update availability
   */
  static updateAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const { isAvailable } = req.body;
    const profile = await riderService.updateAvailability(riderId, isAvailable);
    
    return ApiResponse.success(res, `Rider availability updated to ${isAvailable}`, profile);
  });

  /**
   * Get earnings info
   */
  static getEarnings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const earnings = await riderService.getEarnings(riderId);
    
    return ApiResponse.success(res, 'Rider earnings retrieved successfully', earnings);
  });

  /**
   * Update device token
   */
  static updateDeviceToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const { token } = req.body;
    const profile = await riderService.updateDeviceToken(riderId, token);
    
    return ApiResponse.success(res, 'Device token updated successfully', profile);
  });

  /**
   * Get current active ride
   */
  static getCurrentRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const profile = await riderService.getProfile(riderId);
    
    return ApiResponse.success(res, 'Current ride status retrieved', {
      currentRide: (profile as any).currentRide || null
    });
  });
}
