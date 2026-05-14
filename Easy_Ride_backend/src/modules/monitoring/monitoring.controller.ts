import { Request, Response } from 'express';
import { HealthService } from './health.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class MonitoringController {
  /**
   * Liveness and Readiness check
   */
  static healthCheck = asyncHandler(async (req: Request, res: Response) => {
    const health = await HealthService.checkAll();
    const statusCode = health.status === 'UP' ? 200 : 503;
    
    return res.status(statusCode).json({
      success: health.status === 'UP',
      ...health
    });
  });

  /**
   * Get application metrics (Stub for Prometheus)
   */
  static getMetrics = asyncHandler(async (req: Request, res: Response) => {
    // In production, return Prometheus formatted metrics
    return res.set('Content-Type', 'text/plain').send('# HELP api_requests_total\n# TYPE api_requests_total counter\napi_requests_total 100');
  });
}
