import { Response } from 'express';
import { ScheduleService } from './schedule.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';


const scheduleService = new ScheduleService();

export class ScheduleController {
  /**
   * Create a schedule
   */
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { rideId, scheduledAt, autoAssigned } = req.body;

    const schedule = await scheduleService.createSchedule({
      rideId,
      scheduledAt: new Date(scheduledAt),
      autoAssigned,
    });

    return ApiResponse.success(res, 'Ride scheduled successfully', schedule, httpStatus.CREATED);
  });

  /**
   * Get all schedules for a user
   */
  static getSchedules = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const schedules = await scheduleService.getSchedules(userId.toString());
    return ApiResponse.success(res, 'Schedules fetched', schedules);
  });


  /**
   * Cancel a schedule
   */
  static cancel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }

    await scheduleService.cancelSchedule(id as string, userId.toString());
    return ApiResponse.success(res, 'Schedule cancelled');
  });

}
