import { Promo } from '../types';

class PromoService {
  /**
   * Standard promo discount calculator helper.
   * Ensures that the promo calculations match the backend pricing rules.
   */
  public calculateDiscount(fare: number, promo: Promo): number {
    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (fare * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }

    // Apply maximum discount threshold if present
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }

    // Ensure discount does not exceed the fare itself
    if (discount > fare) {
      discount = fare;
    }

    return discount;
  }
}

export const promoService = new PromoService();
export default promoService;
