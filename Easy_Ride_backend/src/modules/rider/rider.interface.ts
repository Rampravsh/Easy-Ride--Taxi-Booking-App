import { Document, Types } from 'mongoose';
import { UserRole, VerificationStatus, AuthProvider } from '../../shared/enums';

// ---------------------------------------------------------------------------
// VerificationStatus and AuthProvider are now centralized in shared/enums.
// Re-export for backward compatibility so existing imports don't break.
// ---------------------------------------------------------------------------
export { VerificationStatus, AuthProvider };

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
  user: Types.ObjectId;
  firebaseUID: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
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
