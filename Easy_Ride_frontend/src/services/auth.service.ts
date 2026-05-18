import { apiClient } from '../api/axios';
import { StorageService } from './storage.service';
import { FirebaseService } from './firebase.service';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants/api.constants';
import { BackendUser, UserRole, AuthResponse } from '../types/auth';

/**
 * Enterprise Authentication Service.
 * Orchestrates session boot verification, backend token exchange, and logout lifecycles.
 */
export const AuthService = {
  /**
   * Exchanges a Firebase ID Token for a backend user profile.
   * Aligned strictly with POST /auth/firebase Swagger specification.
   */
  async syncBackendAuth(token: string, role: UserRole): Promise<BackendUser> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.FIREBASE, {
        token,
        role,
      });

      const { success, data, message } = response.data;

      if (!success || !data) {
        throw new Error(message || 'Failed to exchange Firebase token with backend');
      }

      // To prevent naming conflicts, map database 'fullName' to return payload
      const syncedUser: BackendUser = {
        ...data,
        fullName: data.fullName || data.name || 'Easy Ride User',
      };

      // Persist state in local storage
      await StorageService.setItem(STORAGE_KEYS.FIREBASE_TOKEN, token);
      await StorageService.setItem(STORAGE_KEYS.BACKEND_USER, syncedUser);
      await StorageService.setItem(STORAGE_KEYS.AUTHENTICATED, true);

      return syncedUser;
    } catch (error) {
      console.error('[AuthService] syncBackendAuth failed:', error);
      throw error;
    }
  },

  /**
   * Restores cached session from AsyncStorage during startup sequence.
   * If a token is found, verify its active validity with Firebase.
   */
  async restoreSession(): Promise<{ token: string | null; user: BackendUser | null } | null> {
    try {
      const token = await StorageService.getItem<string>(STORAGE_KEYS.FIREBASE_TOKEN);
      const user = await StorageService.getItem<BackendUser>(STORAGE_KEYS.BACKEND_USER);
      const authenticated = await StorageService.getItem<boolean>(STORAGE_KEYS.AUTHENTICATED);

      if (!token || !user || !authenticated) {
        return null;
      }

      // Check if Firebase session is intact
      const firebaseToken = await FirebaseService.getIdToken(false);
      if (!firebaseToken) {
        // Firebase state is stale, clean up and require fresh login
        await this.clearLocalSession();
        return null;
      }

      return { token: firebaseToken, user };
    } catch (error) {
      console.error('[AuthService] Session restoration failed:', error);
      await this.clearLocalSession();
      return null;
    }
  },

  /**
   * Clean local AsyncStorage sessions.
   */
  async clearLocalSession(): Promise<void> {
    try {
      await StorageService.removeItem(STORAGE_KEYS.FIREBASE_TOKEN);
      await StorageService.removeItem(STORAGE_KEYS.BACKEND_USER);
      await StorageService.removeItem(STORAGE_KEYS.AUTHENTICATED);
    } catch (error) {
      console.error('[AuthService] Local session cleanup failed:', error);
    }
  },

  /**
   * Complete sign-out operation.
   * Performs Firebase signout and purges all cached/persistent storage credentials.
   */
  async logout(): Promise<void> {
    try {
      // 1. Sign out from Firebase
      await FirebaseService.logout();
    } catch (error) {
      console.warn('[AuthService] Firebase logout error (proceeding with local cleanup):', error);
    } finally {
      // 2. Clear all local AsyncStorage sessions
      await this.clearLocalSession();
    }
  }
};
