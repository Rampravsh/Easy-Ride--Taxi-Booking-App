import { Document, Types } from 'mongoose';
import { PromoType, DiscountType, VehicleType } from '../../shared/enums';

export interface IPromo {
  code: string;
  promoType: PromoType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minimumFare: number;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  validFrom: Date;
  validUntil: Date;
  applicableRideTypes: VehicleType[];
  applicableCities: string[];
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPromoDocument extends IPromo, Document {}
