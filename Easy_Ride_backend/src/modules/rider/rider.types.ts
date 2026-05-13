import { VerificationStatus, IRiderLocation, IRiderDocuments } from './rider.interface';

export type RiderProfileResponse = {
  id: string;
  firebaseUID: string;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  isOnline: boolean;
  isAvailable: boolean;
  verificationStatus: VerificationStatus;
  currentLocation: IRiderLocation;
  averageRating: number;
  totalEarnings: number;
  totalTrips: number;
  walletBalance: number;
};

export type UpdateRiderProfileDTO = {
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

export type UpdateLocationDTO = {
  latitude: number;
  longitude: number;
};

export type UpdateStatusDTO = {
  isOnline: boolean;
};

export type UpdateAvailabilityDTO = {
  isAvailable: boolean;
};

export type RiderDocumentDTO = {
  type: keyof IRiderDocuments;
  url: string;
};

export type RiderEarningsResponse = {
  totalEarnings: number;
  totalTrips: number;
  walletBalance: number;
};
