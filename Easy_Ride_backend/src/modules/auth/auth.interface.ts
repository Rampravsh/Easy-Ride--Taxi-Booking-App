import { UserRole } from '../../shared/enums';

export interface IFirebaseAuthPayload {
  token: string;
  role: UserRole;
}

export interface IDecodedFirebaseToken {
  uid: string;
  email?: string;
  phone_number?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export interface IAuthUser {
  _id: string;
  firebaseUID: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
}
