import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';


const chatService = new ChatService();

export class ChatController {
  /**
   * Send a message via HTTP (optional, primarily via Socket)
   */
  static sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const senderId = req.user?._id;
    if (!senderId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { rideId, content, messageType, metadata } = req.body;

    const message = await chatService.sendMessage({
      rideId,
      senderId: senderId.toString(),
      content,
      messageType,
      metadata,
    });


    return ApiResponse.success(res, 'Message sent', message, httpStatus.CREATED);
  });

  /**
   * Get message history
   */
  static getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { rideId } = req.params;
    const { limit, lastCreatedAt } = req.query;

    const messages = await chatService.getMessages(
      rideId as string,
      userId.toString(),
      limit ? parseInt(limit as string) : 50,
      lastCreatedAt ? new Date(lastCreatedAt as string) : undefined
    );


    return ApiResponse.success(res, 'Messages fetched', messages);
  });

  /**
   * Get unread count
   */
  static getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const count = await chatService.getUnreadCount(userId.toString());
    return ApiResponse.success(res, 'Unread count fetched', { count });
  });


  /**
   * Mark messages as read
   */
  static markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { rideId } = req.params;

    await chatService.markAsRead(rideId as string, userId.toString());
    return ApiResponse.success(res, 'Messages marked as read', {});
  });

}
