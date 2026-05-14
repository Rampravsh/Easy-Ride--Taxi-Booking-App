import { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';

export class AnalyticsController {
  /**
   * Get operations overview
   */
  static getOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const metrics = await AnalyticsService.getOpsOverview();
    return ApiResponse.success(res, 'Operations overview fetched', metrics);
  });

  /**
   * Get revenue metrics
   */
  static getRevenue = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    const metrics = await AnalyticsService.getRevenueMetrics(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    return ApiResponse.success(res, 'Revenue metrics fetched', metrics);
  });
}
