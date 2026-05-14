import { PRICING_CONSTANTS, FareCalculationParams } from './pricing.constants';
import { PromoType, DiscountType } from '../../shared/enums';

export class PricingService {
  /**
   * Calculate base fare for a ride
   */
  static calculateFare(params: FareCalculationParams): number {
    const { distance, duration, vehicleType, isPool } = params;
    
    const baseFare = PRICING_CONSTANTS.BASE_FARES[vehicleType as keyof typeof PRICING_CONSTANTS.BASE_FARES] || 50;
    const distanceFare = distance * (PRICING_CONSTANTS.PER_KM_RATES[vehicleType as keyof typeof PRICING_CONSTANTS.PER_KM_RATES] || 10);
    const timeFare = duration * (PRICING_CONSTANTS.PER_MINUTE_RATES[vehicleType as keyof typeof PRICING_CONSTANTS.PER_MINUTE_RATES] || 2);
    
    let totalFare = baseFare + distanceFare + timeFare;
    
    if (isPool) {
      totalFare = totalFare * (1 - PRICING_CONSTANTS.POOL_DISCOUNT);
    }
    
    return Math.round(totalFare);
  }

  /**
   * Calculate surge multiplier based on demand and supply
   */
  static calculateSurge(activeRequests: number, activeRiders: number): number {
    if (activeRiders === 0) return 2.0; // Max surge if no riders
    
    const ratio = activeRequests / activeRiders;
    
    if (ratio > 2.0) return 1.8;
    if (ratio > 1.5) return 1.5;
    if (ratio > 1.2) return 1.2;
    
    return 1.0;
  }

  /**
   * Apply discount from a promo code
   */
  static applyDiscount(fare: number, promo: any): number {
    let discount = 0;
    
    if (promo.discountType === DiscountType.PERCENTAGE) {
      discount = (fare * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.discountValue;
    }
    
    const finalFare = fare - discount;
    return Math.max(Math.round(finalFare), 0);
  }
}
