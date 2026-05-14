import { Response } from 'express';
import { ReviewService } from './review.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';

export class ReviewController {
  static createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const review = await ReviewService.createReview({
      ...req.body,
      reviewerId: userId,
    });
    return ApiResponse.success(res, 'Review created successfully', review, httpStatus.CREATED);
  });

  static getRideReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { rideId } = req.params;
    const reviews = await ReviewService.getRideReviews(rideId as string);

    return ApiResponse.success(res, 'Ride reviews fetched', reviews);
  });

  static getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const reviews = await ReviewService.getUserReviews(userId as string);

    return ApiResponse.success(res, 'User reviews fetched', reviews);
  });
}
