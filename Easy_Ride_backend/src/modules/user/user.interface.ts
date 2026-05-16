import { Document, Types } from 'mongoose';
import { UserRole, AuthProvider } from '../../shared/enums';

// ---------------------------------------------------------------------------
// AuthProvider is now centralized in shared/enums.
// Re-export for backward compatibility so existing imports don't break.
// ---------------------------------------------------------------------------
export { AuthProvider };

export interface ICoordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ISavedAddress {
  _id?: Types.ObjectId;
  label: string;
  address: string;
  location: ICoordinates;
}

export interface IEmergencyContact {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  relationship: string;
}

export interface IUserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export interface IUser extends Document {
  firebaseUID: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  walletBalance: number;
  rating: number;
  totalRides: number;
  savedAddresses: ISavedAddress[];
  deviceTokens: string[];
  isBlocked: boolean;
  preferences: IUserPreferences;
  emergencyContacts: IEmergencyContact[];
  createdAt: Date;
  updatedAt: Date;
}
