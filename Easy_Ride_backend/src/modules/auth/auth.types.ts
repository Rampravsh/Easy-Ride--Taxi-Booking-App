import { IAuthUser } from './auth.interface';

export type AuthResponse = {
  user: IAuthUser;
  token?: string; // Firebase token is usually enough, but we might want to return profile info
};
