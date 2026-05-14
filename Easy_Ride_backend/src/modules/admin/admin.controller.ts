import { Response } from 'express';
import { AdminService } from './admin.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';

export class AdminController {
  /**
   * Verify a rider
   */
  static verifyRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user?._id;
    if (!adminId) throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);

    const { id } = req.params;
    const { status, reason } = req.body;

    const rider = await AdminService.verifyRider(id as string, adminId.toString(), status, reason);

    return ApiResponse.success(res, 'Rider verification updated', rider);
  });

  /**
   * Get platform stats
   */
  static getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await AdminService.getPlatformStats();
    return ApiResponse.success(res, 'Platform stats fetched', stats);
  });
}
