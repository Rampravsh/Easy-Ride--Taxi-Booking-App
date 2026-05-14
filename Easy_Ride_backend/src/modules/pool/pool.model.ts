import { Schema, model } from 'mongoose';
import { IPoolDocument } from './pool.interface';
import { PoolStatus } from '../../shared/enums';

const poolPassengerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ride: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
  seats: { type: Number, default: 1 },
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
    address: String,
  },
  dropLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
    address: String,
  },
  fare: { type: Number, required: true },
  joinedAt: { type: Date, default: Date.now },
});

const poolSchema = new Schema<IPoolDocument>(
  {
    mainRide: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      index: true,
    },
    passengers: [poolPassengerSchema],
    availableSeats: {
      type: Number,
      required: true,
    },
    maxSeats: {
      type: Number,
      default: 4,
    },
    route: {
      polyline: String,
      waypoints: [Schema.Types.Mixed],
    },
    status: {
      type: String,
      enum: Object.values(PoolStatus),
      default: PoolStatus.AVAILABLE,
    },
    timestamps: {
      startedAt: Date,
      endedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Pool = model<IPoolDocument>('Pool', poolSchema);
