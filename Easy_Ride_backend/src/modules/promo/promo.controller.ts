import { Response } from 'express';
import { PromoService } from './promo.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types/express.types';
import httpStatus from 'http-status';
import { ApiError } from '../../shared/errors/ApiError';


const promoService = new PromoService();

export class PromoController {
  /**
   * Validate a promo code
   */
  static validate = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code, rideType, city, fare } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }

    const promo = await promoService.validatePromo({
      code,
      userId: userId.toString(),
      rideType,
      city,
      fare,
    });


    return ApiResponse.success(res, 'Promo code is valid', promo);
  });

  /**
   * Apply a promo code
   */
  static apply = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code, rideType, city, fare } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }

    const result = await promoService.applyPromo({
      code,
      userId: userId.toString(),
      rideType,
      city,
      fare,
    });


    return ApiResponse.success(res, 'Promo code applied', result);
  });
}
