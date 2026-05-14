import { Request, Response } from 'express';
import { CallService } from './call.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';


const callService = new CallService();

export class CallController {
  /**
   * Initiate a call
   */
  static initiateCall = asyncHandler(async (req: AuthRequest, res: Response) => {
    const callerId = req.user?._id;
    if (!callerId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { rideId, callType } = req.body;

    const result = await callService.initiateCall({
      rideId,
      callerId: callerId.toString(),
      callType,
    });


    return ApiResponse.success(res, 'Call initiated', result, httpStatus.CREATED);
  });

  /**
   * Accept a call
   */
  static acceptCall = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { callId } = req.params;

    const result = await callService.acceptCall(callId as string, userId.toString());
    return ApiResponse.success(res, 'Call accepted', result);
  });


  /**
   * Reject a call
   */
  static rejectCall = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { callId } = req.params;

    await callService.rejectCall(callId as string, userId.toString());
    return ApiResponse.success(res, 'Call rejected', {});
  });


  /**
   * End a call
   */
  static endCall = asyncHandler(async (req: Request, res: Response) => {
    const { callId } = req.params;
    await callService.endCall(callId as string);
    return ApiResponse.success(res, 'Call ended', {});
  });


  /**
   * Get call history
   */
  static getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }
    const { page, limit } = req.query;

    const history = await callService.getHistory(
      userId.toString(),
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    return ApiResponse.success(res, 'Call history fetched', history);
  });

}
