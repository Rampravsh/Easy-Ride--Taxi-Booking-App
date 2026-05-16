import { Document, Types } from 'mongoose';
import { PromoType, DiscountType, PromoStatus, VehicleType } from '../../shared/enums';

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
  isActive: boolean;               // kept for simple boolean checks
  promoStatus: PromoStatus;        // structured status for admin workflows
  createdBy?: Types.ObjectId;      // admin who created the promo
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPromoDocument extends IPromo, Document {}
