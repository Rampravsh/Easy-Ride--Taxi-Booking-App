import { ApiResponse } from './api';

/**
 * Desired system roles matching the Swagger specs.
 */
export type UserRole = 'user' | 'rider' | 'admin';

/**
 * Represents a saved address shortcut for rapid booking.
 */
export interface SavedAddress {
  _id?: string;
  label: string;
  address: string;
  location?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}

/**
 * Represents emergency contacts added by the passenger.
 */
export interface EmergencyContact {
  _id?: string;
  name: string;
  phone: string;
  relationship: string;
}

/**
 * Passenger preference options.
 */
export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  language: string;
  theme: 'light' | 'dark' | 'system';
}

/**
 * Enterprise Backend User model mapping strictly to the backend UserSchema.
 * Resiliently accommodates both `name` (from OAuth exchange) and `fullName` (database model).
 */
export interface BackendUser {
  _id: string;
  firebaseUID: string;
  fullName: string;
  name?: string; // Fallback helper field for /auth/firebase mapping
  email: string | null;
  phone: string | null;
  role: UserRole;
  profileImage?: string | null;
  walletBalance: number;
  rating: number;
  totalRides: number;
  savedAddresses?: SavedAddress[];
  deviceTokens?: string[];
  isBlocked: boolean;
  preferences?: UserPreferences;
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload sent to the backend /auth/firebase endpoint.
 */
export interface FirebaseAuthPayload {
  token: string;
  role: UserRole;
}

/**
 * The direct response structure from the backend exchange.
 * Aligned with RESPONSE_SCHEMAS.SUCCESS wrapped object.
 */
export type AuthResponse = ApiResponse<BackendUser>;

/**
 * Local Redux state structure representing auth slice data.
 */
export interface AuthState {
  firebaseUser: any | null; // Firebase User instance
  firebaseToken: string | null; // Cached ID Token string
  backendUser: BackendUser | null; // Verified database user
  authenticated: boolean; // Flag if fully signed in
  initialized: boolean; // Flag if auth restoration check completed
  loading: boolean; // General slice loading state
  error: string | null; // Slice error state
}
