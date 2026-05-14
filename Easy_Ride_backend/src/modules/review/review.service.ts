import { Review } from './review.model';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';

export class ReviewService {
  static async createReview(data: any) {
    return await Review.create(data);
  }

  static async getRideReviews(rideId: string) {
    return await Review.find({ rideId }).populate('reviewerId', 'fullName avatar');
  }

  static async getUserReviews(userId: string) {
    // This could be reviews written BY the user or ABOUT the user
    // Usually we want reviews about the rider if it's a rider profile
    return await Review.find({ receiverId: userId }).populate('reviewerId', 'fullName avatar');
  }
}
