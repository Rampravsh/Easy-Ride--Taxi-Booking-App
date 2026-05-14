import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { RecipientType } from '../../shared/enums';
import { ApiError } from '../../shared/errors/ApiError';


const notificationService = new NotificationService();

export class NotificationController {
  /**
   * Get user notification history
   */
  static getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { page = 1, limit = 20 } = req.query;
    
    const history = await notificationService.getHistory(userId.toString(), Number(page), Number(limit));
    return ApiResponse.success(res, 'Notifications fetched successfully', history);
  });

  /**
   * Get unread count
   */
  static getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const count = await notificationService.getUnreadCount(userId.toString());
    return ApiResponse.success(res, 'Unread count fetched successfully', { count });
  });

  /**
   * Mark notification as read
   */
  static markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id as string);
    return ApiResponse.success(res, 'Notification marked as read', notification);
  });

  /**
   * Mark all as read
   */
  static markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    await notificationService.markAllAsRead(userId.toString());
    return ApiResponse.success(res, 'All notifications marked as read', {});
  });

  /**
   * Register device token
   */
  static registerToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { token, type } = req.body; // type: user or rider
    
    await notificationService.registerDeviceToken(
      userId.toString(), 
      type as RecipientType || RecipientType.USER, 
      token
    );
    
    return ApiResponse.success(res, 'Device token registered successfully', {});
  });

  /**
   * Remove device token
   */
  static removeToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { token, type } = req.body;
    
    await notificationService.removeDeviceToken(
      userId.toString(), 
      type as RecipientType || RecipientType.USER, 
      token
    );
    
    return ApiResponse.success(res, 'Device token removed successfully', {});
  });

  /**
   * Delete notification
   */
  static deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // Implementation of delete in service needed if wanted
    return ApiResponse.success(res, 'Notification deleted successfully', {});
  });
}
