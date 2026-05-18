export type PromoType = 'discount' | 'cashback' | 'referral';
export type DiscountType = 'percentage' | 'flat';
export type PromoStatus = 'active' | 'inactive' | 'expired' | 'exhausted';

export interface Promo {
  _id: string;
  code: string;
  promoType: PromoType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minimumFare: number;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  applicableRideTypes: string[];
  applicableCities: string[];
  isActive: boolean;
  promoStatus: PromoStatus;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PromoValidation {
  promoCode: string;
  originalFare: number;
  discountAmount: number;
  finalFare: number;
  promoType: PromoType;
}
