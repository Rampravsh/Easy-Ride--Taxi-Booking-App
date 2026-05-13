import { Response } from 'express';
import { RideService } from './ride.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';

const rideService = new RideService();

export class RideController {
  /**
   * Get fare estimate
   */
  static estimateFare = asyncHandler(async (req: AuthRequest, res: Response) => {
    const estimate = await rideService.estimateFare(req.body);
    return ApiResponse.success(res, 'Fare estimate calculated', estimate);
  });

  /**
   * Book a new ride
   */
  static bookRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const ride = await rideService.bookRide(userId, req.body);
    return ApiResponse.success(res, 'Ride booked successfully. Searching for riders.', ride, 201);
  });

  /**
   * Get ride details
   */
  static getRideDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const rideId = req.params.rideId as string;
    const ride = await rideService.getRideDetails(rideId);
    return ApiResponse.success(res, 'Ride details retrieved', ride);
  });

  /**
   * Accept ride (Rider only)
   */
  static acceptRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const rideId = req.params.rideId as string;
    const ride = await rideService.acceptRide(riderId, rideId, req.body);
    return ApiResponse.success(res, 'Ride accepted successfully', ride);
  });

  /**
   * Mark as arrived at pickup (Rider only)
   */
  static markAsArrived = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const rideId = req.params.rideId as string;
    const ride = await rideService.markAsArrived(riderId, rideId);
    return ApiResponse.success(res, 'Marked as arrived at pickup location', ride);
  });

  /**
   * Start ride with OTP (Rider only)
   */
  static startRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const rideId = req.params.rideId as string;
    const { otp } = req.body;
    const ride = await rideService.startRide(riderId, rideId, otp);
    return ApiResponse.success(res, 'Ride started successfully', ride);
  });

  /**
   * Complete ride (Rider only)
   */
  static completeRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riderId = req.user?._id.toString() as string;
    const rideId = req.params.rideId as string;
    const ride = await rideService.completeRide(riderId, rideId);
    return ApiResponse.success(res, 'Ride completed successfully', ride);
  });

  /**
   * Cancel ride
   */
  static cancelRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const rideId = req.params.rideId as string;
    const { reason } = req.body;
    const ride = await rideService.cancelRide(userId, rideId, reason);
    return ApiResponse.success(res, 'Ride cancelled successfully', ride);
  });
}
