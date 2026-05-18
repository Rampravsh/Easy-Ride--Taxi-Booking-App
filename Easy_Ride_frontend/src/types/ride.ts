import { GeoCoordinates, GeoLocationPoint } from './user';

export type RideStatus = 'searching' | 'accepted' | 'arrived' | 'started' | 'completed' | 'cancelled';
export type VehicleCategory = 'saver' | 'premium' | 'luxury';
export type RideType = 'bike' | 'auto' | 'cab';

export interface FareBreakdown {
  baseFare: number;
  surgeMultiplier: number;
  taxAmount: number;
  totalFare: number;
}

export interface RideEstimateRequest {
  pickupCoordinates: GeoCoordinates; // [longitude, latitude]
  dropCoordinates: GeoCoordinates;   // [longitude, latitude]
  rideType: RideType;
  rideCategory: VehicleCategory;
}

export interface RideEstimateResponse {
  estimatedDistance: number; // Calculated direct distance in meters
  estimatedDuration: number; // Estimated travel duration in seconds
  baseFare: number;
  surgeMultiplier: number;
  taxAmount: number;
  totalFare: number;
}

export interface RideBookingPayload {
  pickupCoordinates: GeoCoordinates; // [longitude, latitude]
  dropCoordinates: GeoCoordinates;   // [longitude, latitude]
  pickupAddress: string;
  dropAddress: string;
  rideType: RideType;
  rideCategory: VehicleCategory;
  paymentMethod: 'wallet' | 'cash' | 'card';
}

export interface RideLocation {
  type: 'Point';
  coordinates: GeoCoordinates; // [longitude, latitude]
  address: string;
}

export interface SwaggerVehicle {
  _id: string;
  rider: string;
  type: RideType;
  category: VehicleCategory;
  brand: string;
  modelName: string;
  color: string;
  year: number;
  numberPlate: string;
  seatingCapacity: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'cng';
  vehicleImage?: string;
}

export interface SwaggerRider {
  _id: string;
  user: string;
  role: 'RIDER';
  fullName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  averageRating: number;
  totalTrips: number;
  isOnline: boolean;
  isAvailable: boolean;
  currentLocation: {
    type: 'Point';
    coordinates: GeoCoordinates;
  };
}

export interface Ride {
  _id: string;
  user: string; // Associated User ID (Passenger)
  rider?: string | SwaggerRider | null; // Associated Rider profile (can be populated or ID string)
  vehicle?: string | SwaggerVehicle | null; // Associated Vehicle profile (can be populated or ID string)
  rideType: RideType;
  rideCategory: VehicleCategory;
  status: RideStatus;
  pickupLocation: RideLocation;
  dropLocation: RideLocation;
  routePath?: string;
  estimatedDistance: number;
  estimatedDuration: number;
  actualDistance?: number;
  actualDuration?: number;
  baseFare: number;
  surgeMultiplier: number;
  taxAmount: number;
  totalFare: number;
  paymentMethod: 'wallet' | 'cash' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  otp: string;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancelledByModel?: 'User' | 'Rider' | 'Admin' | null;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChargeBreakdown {
  baseFare: number;
  vat: number;
  promoDiscount?: number;
  total: number;
}
