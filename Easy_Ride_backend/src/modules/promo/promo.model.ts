import { Schema, model } from 'mongoose';
import { IPromoDocument } from './promo.interface';
import { PromoType, DiscountType, VehicleType, PromoStatus } from '../../shared/enums';

const promoSchema = new Schema<IPromoDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    promoType: {
      type: String,
      enum: Object.values(PromoType),
      default: PromoType.DISCOUNT,
    },
    discountType: {
      type: String,
      enum: Object.values(DiscountType),
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
    },
    minimumFare: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    applicableRideTypes: [
      {
        type: String,
        enum: Object.values(VehicleType),
      },
    ],
    applicableCities: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    promoStatus: {
      type: String,
      enum: Object.values(PromoStatus),
      default: PromoStatus.ACTIVE,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Admin who created the promo
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const Promo = model<IPromoDocument>('Promo', promoSchema);
