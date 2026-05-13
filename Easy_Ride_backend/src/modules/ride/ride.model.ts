import mongoose, { Schema } from 'mongoose';
import { IRide } from './ride.interface';
import { RideStatus, PaymentStatus, PaymentMethod, VehicleType } from '../../shared/enums';
import { VehicleCategory } from '../vehicle/vehicle.interface';

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  address: { type: String, required: true },
});

const rideSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rider: { type: Schema.Types.ObjectId, ref: 'Rider', index: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    rideType: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    rideCategory: {
      type: String,
      enum: Object.values(VehicleCategory),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.SEARCHING,
      index: true,
    },
    pickupLocation: {
      type: locationSchema,
      required: true,
    },
    dropLocation: {
      type: locationSchema,
      required: true,
    },
    routePath: { type: String },
    estimatedDistance: { type: Number, required: true },
    estimatedDuration: { type: Number, required: true },
    actualDistance: { type: Number },
    actualDuration: { type: Number },
    baseFare: { type: Number, required: true },
    surgeMultiplier: { type: Number, default: 1.0 },
    taxAmount: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.CASH,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    otp: { type: String, required: true },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelledBy: { type: Schema.Types.ObjectId, refPath: 'cancelledByModel' },
    cancelledByModel: { type: String, enum: ['User', 'Rider', 'Admin'] },
    cancellationReason: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mandatory Geospatial Indexes
rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ dropLocation: '2dsphere' });

// Compound indexes for history queries
rideSchema.index({ user: 1, createdAt: -1 });
rideSchema.index({ rider: 1, createdAt: -1 });

const Ride = mongoose.model<IRide>('Ride', rideSchema);

export default Ride;
