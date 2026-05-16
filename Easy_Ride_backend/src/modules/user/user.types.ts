import { UserRole } from '../../shared/enums';
import { AuthProvider, IUserPreferences, ISavedAddress, IEmergencyContact } from './user.interface';

export type UserProfileResponse = {
  id: string;
  firebaseUID: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  walletBalance: number;
  rating: number;
  savedAddresses: ISavedAddress[];
  preferences: IUserPreferences;
  emergencyContacts: IEmergencyContact[];
  isBlocked: boolean;
};

export type UpdateProfileDTO = {
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

export type CreateUserDTO = {
  firebaseUID: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  authProvider?: AuthProvider;
};

export type SaveAddressDTO = {
  label: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
};

export type DeviceTokenDTO = {
  token: string;
};

export type UserPreferencesDTO = Partial<IUserPreferences>;
