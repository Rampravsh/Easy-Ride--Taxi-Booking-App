import { Document, Types } from 'mongoose';
import { RideStatus, PaymentStatus, PaymentMethod, VehicleType } from '../../shared/enums';
import { VehicleCategory } from '../vehicle/vehicle.interface';

export interface IRideLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
}

export interface IRide extends Document {
  user: Types.ObjectId;
  rider?: Types.ObjectId;
  vehicle?: Types.ObjectId;
  rideType: VehicleType;
  rideCategory: VehicleCategory;
  status: RideStatus;
  pickupLocation: IRideLocation;
  dropLocation: IRideLocation;
  routePath?: string; // Encoded polyline
  estimatedDistance: number; // in meters
  estimatedDuration: number; // in seconds
  actualDistance?: number;
  actualDuration?: number;
  baseFare: number;
  surgeMultiplier: number;
  taxAmount: number;
  totalFare: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  otp: string;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: Types.ObjectId;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
