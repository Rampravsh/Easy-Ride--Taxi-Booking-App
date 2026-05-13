import { VehicleType } from '../../shared/enums';
import { VehicleCategory } from '../vehicle/vehicle.interface';
import { PaymentMethod, RideStatus } from '../../shared/enums';

export type FareEstimateDTO = {
  pickupCoordinates: [number, number];
  dropCoordinates: [number, number];
  rideType: VehicleType;
  rideCategory: VehicleCategory;
};

export type FareEstimateResponse = {
  estimatedDistance: number;
  estimatedDuration: number;
  baseFare: number;
  taxAmount: number;
  totalFare: number;
  surgeMultiplier: number;
};

export type BookRideDTO = FareEstimateDTO & {
  pickupAddress: string;
  dropAddress: string;
  paymentMethod: PaymentMethod;
};

export type RideResponse = {
  id: string;
  user: string;
  rider?: string;
  vehicle?: string;
  status: RideStatus;
  pickupLocation: {
    address: string;
    coordinates: [number, number];
  };
  dropLocation: {
    address: string;
    coordinates: [number, number];
  };
  totalFare: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  otp?: string;
  startedAt?: Date;
  completedAt?: Date;
};

export type CancelRideDTO = {
  reason: string;
};

export type AcceptRideDTO = {
  vehicleId: string;
};
