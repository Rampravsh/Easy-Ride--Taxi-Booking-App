/**
 * Represents the geographic coordinates [longitude, latitude] for geo-spatial MongoDB points.
 */
export type GeoCoordinates = [number, number];

/**
 * Geo-JSON Location Point representation.
 */
export interface GeoLocationPoint {
  type: 'Point';
  coordinates: GeoCoordinates;
}

/**
 * Saved Address entry matching the database subschema.
 */
export interface SavedAddress {
  _id?: string;
  label: string; // E.g., Home, Work, Gym
  address: string; // Full address string
  location?: GeoLocationPoint;
}

/**
 * User Notification preference channels toggle mapping.
 */
export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
}

/**
 * User Preference settings profile.
 */
export interface UserPreferences {
  notifications: NotificationPreferences;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

/**
 * User Emergency Contact profile.
 */
export interface EmergencyContact {
  _id?: string;
  name: string;
  phone: string;
  relationship: string;
}

/**
 * Enterprise User Profile matching strictly the backend UserSchema.
 */
export interface UserProfile {
  _id: string;
  firebaseUID: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: 'user' | 'rider' | 'admin';
  profileImage: string | null;
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
 * FCM Device Registration request payload payload.
 */
export interface DeviceTokenPayload {
  token: string;
}

/**
 * Legacy UI User stub representation.
 */
export interface User {
  id: string;
  name: string;
  avatar?: any;
  phone?: string;
  email?: string;
  rating?: number;
  totalReviews?: number;
}

/**
 * Legacy UI Driver stub representation.
 */
export interface Driver extends User {
  status: 'available' | 'busy' | 'offline';
  location?: {
    latitude: number;
    longitude: number;
  };
}

