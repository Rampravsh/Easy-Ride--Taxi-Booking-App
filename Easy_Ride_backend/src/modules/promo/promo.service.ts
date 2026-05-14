import { Promo } from './promo.model';
import { IPromoDocument } from './promo.interface';
import { PricingService } from '../pricing/pricing.service';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import dayjs from 'dayjs';

export class PromoService {
  /**
   * Validate a promo code
   */
  async validatePromo(params: {
    code: string;
    userId: string;
    rideType: string;
    city: string;
    fare: number;
  }) {
    const { code, userId, rideType, city, fare } = params;

    const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) {
      throw new ApiError('Invalid or expired promo code', httpStatus.BAD_REQUEST);
    }

    // 1. Expiry Check
    const now = dayjs();
    if (now.isBefore(promo.validFrom) || now.isAfter(promo.validUntil)) {
      throw new ApiError('Promo code has expired', httpStatus.BAD_REQUEST);
    }

    // 2. Usage Limit Check
    if (promo.usageCount >= promo.usageLimit) {
      throw new ApiError('Promo code usage limit reached', httpStatus.BAD_REQUEST);
    }

    // 3. Minimum Fare Check
    if (fare < promo.minimumFare) {
      throw new ApiError(`Minimum fare for this promo is ${promo.minimumFare}`, httpStatus.BAD_REQUEST);
    }

    // 4. Ride Type Check
    if (promo.applicableRideTypes.length > 0 && !promo.applicableRideTypes.includes(rideType as any)) {
      throw new ApiError('Promo code not applicable for this ride type', httpStatus.BAD_REQUEST);
    }

    // 5. City Check
    if (promo.applicableCities.length > 0 && !promo.applicableCities.includes(city)) {
      throw new ApiError('Promo code not applicable in your city', httpStatus.BAD_REQUEST);
    }

    // 6. User Limit Check (requires a Usage record, omitted for brevity but recommended)
    // const userUsage = await PromoUsage.countDocuments({ promo: promo._id, user: userId });
    // if (userUsage >= promo.perUserLimit) { throw new ApiError('You have already used this promo', httpStatus.BAD_REQUEST); }

    return promo;
  }

  /**
   * Apply a promo code to a fare
   */
  async applyPromo(params: {
    code: string;
    userId: string;
    rideType: string;
    city: string;
    fare: number;
  }) {
    const promo = await this.validatePromo(params);
    const finalFare = PricingService.applyDiscount(params.fare, promo);
    const discountAmount = params.fare - finalFare;

    return {
      promoCode: promo.code,
      originalFare: params.fare,
      discountAmount,
      finalFare,
      promoType: promo.promoType,
    };
  }

  /**
   * Increment usage count
   */
  async recordUsage(promoId: string) {
    await Promo.findByIdAndUpdate(promoId, { $inc: { usageCount: 1 } });
  }
}
