import { Document, Types } from 'mongoose';
import { UserRole } from '../../shared/enums';
import { AuthProvider } from '../user/user.interface';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IRiderDocument {
  url: string;
  status: VerificationStatus;
  uploadedAt: Date;
}

export interface IRiderDocuments {
  drivingLicense: IRiderDocument;
  insurance: IRiderDocument;
  rcBook: IRiderDocument;
  aadhaar: IRiderDocument;
  profilePhoto: IRiderDocument;
}

export interface IRiderLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IRider extends Document {
  firebaseUID: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  isOnline: boolean;
  isAvailable: boolean;
  currentRide?: Types.ObjectId;
  currentLocation: IRiderLocation;
  walletBalance: number;
  totalEarnings: number;
  totalTrips: number;
  averageRating: number;
  deviceTokens: string[];
  emergencyMode: boolean;
  verificationStatus: VerificationStatus;
  documents: IRiderDocuments;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}
