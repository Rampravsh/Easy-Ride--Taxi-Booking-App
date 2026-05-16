import { Response } from 'express';
import { AdminService } from './admin.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';

export class AdminController {
  /**
   * Verify a rider's KYC/documents
   */
  static verifyRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user?._id;
    if (!adminId) throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);

    const id = req.params.id as string;
    const { status, reason } = req.body;

    const rider = await AdminService.verifyRider(id, adminId.toString(), status, reason);

    return ApiResponse.success(res, 'Rider verification updated', rider);
  });

  /**
   * Get platform-wide statistics
   */
  static getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await AdminService.getPlatformStats();
    return ApiResponse.success(res, 'Platform stats fetched', stats);
  });

  /**
   * Block or unblock a user account
   */
  static blockUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user?._id;
    if (!adminId) throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);

    const id = req.params.id as string;
    const { isBlocked, reason } = req.body;

    const result = await AdminService.blockUser(id, adminId.toString(), isBlocked, reason);
    return ApiResponse.success(
      res,
      isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      result
    );
  });

  /**
   * Block or unblock a rider account
   */
  static blockRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user?._id;
    if (!adminId) throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);

    const id = req.params.id as string;
    const { isBlocked, reason } = req.body;

    const result = await AdminService.blockRider(id, adminId.toString(), isBlocked, reason);
    return ApiResponse.success(
      res,
      isBlocked ? 'Rider blocked successfully' : 'Rider unblocked successfully',
      result
    );
  });

  /**
   * Process a manual refund
   */
  static processRefund = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user?._id;
    if (!adminId) throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);

    const transactionId = req.params.transactionId as string;
    const { amount, reason } = req.body;

    const result = await AdminService.processManualRefund(
      transactionId,
      adminId.toString(),
      amount,
      reason
    );
    return ApiResponse.success(res, 'Refund processed successfully', result);
  });

  /**
   * Get audit logs
   */
  static getAuditLog = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 20, action, resource } = req.query;

    const result = await AdminService.getAuditLog({
      page: Number(page),
      limit: Number(limit),
      action: action as string,
      resource: resource as string,
    });
    return ApiResponse.success(res, 'Audit log retrieved', result);
  });
}
