import mongoose, { Schema, Document } from 'mongoose';
import { RideStatus, PaymentStatus } from '../../shared/enums';

export interface IRide extends Document {
  user: mongoose.Types.ObjectId;
  rider?: mongoose.Types.ObjectId;
  pickupLocation: {
    address: string;
    coordinates: number[];
  };
  destinationLocation: {
    address: string;
    coordinates: number[];
  };
  distance: number;
  duration: number;
  fare: number;
  status: RideStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  otp: string;
  startedAt?: Date;
  completedAt?: Date;
  cancelledBy?: string;
  cancelReason?: string;
}

const rideSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
    pickupLocation: {
      address: { type: String, required: true },
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    destinationLocation: {
      address: { type: String, required: true },
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    fare: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMethod: { type: String, default: 'cash' },
    otp: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledBy: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ destinationLocation: '2dsphere' });

export default mongoose.model<IRide>('Ride', rideSchema);
