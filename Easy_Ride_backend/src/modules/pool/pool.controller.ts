import { Response } from 'express';
import { PoolService } from './pool.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';


const poolService = new PoolService();

export class PoolController {
  /**
   * Join or create a pool
   */
  static join = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { rideId, pickup, drop, seats, fare } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }

    const pool = await poolService.findOrCreatePool({
      rideId,
      userId: userId.toString(),
      pickup,
      drop,
      seats,
      fare,
    });


    return ApiResponse.success(res, 'Joined pool successfully', pool);
  });

  /**
   * Leave a pool
   */
  static leave = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { poolId } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }

    await poolService.leavePool(poolId, userId.toString());
    return ApiResponse.success(res, 'Left pool successfully');
  });

}
