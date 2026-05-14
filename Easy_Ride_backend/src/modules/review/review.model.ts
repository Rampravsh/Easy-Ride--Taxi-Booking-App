import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  rideId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  receiverId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes for fast lookup
reviewSchema.index({ rideId: 1 });
reviewSchema.index({ receiverId: 1 });

export const Review = model<IReview>('Review', reviewSchema);
