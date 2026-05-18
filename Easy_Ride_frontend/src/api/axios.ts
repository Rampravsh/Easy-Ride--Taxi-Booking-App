import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../constants/env';
import { API_TIMEOUT } from '../constants/api.constants';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../constants/api.constants';
import { FirebaseService } from '../services/firebase.service';

/**
 * Enterprise Axios Instance configured with environment base URL and timeouts.
 */
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// A registry of auth failure callbacks (e.g. to reset Redux store or route away)
let unauthorizedCallback: (() => void) | null = null;

export const registerUnauthorizedHandler = (callback: () => void) => {
  unauthorizedCallback = callback;
};

/**
 * Request Interceptor: Dynamic Auth Token Injection.
 * Acquires current Firebase token (checks memory/AsyncStorage first, falls back to refreshing Firebase)
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 1. Try to fetch token from Storage first (speed optimize)
      let token = await StorageService.getItem<string>(STORAGE_KEYS.FIREBASE_TOKEN);

      // 2. Fall back to direct Firebase refresh if AsyncStorage is empty or expired
      if (!token) {
        token = await FirebaseService.getIdToken(false);
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[apiClient] Token injection interceptor warning:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Centralized Error and 401 Handling.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // Handle 401 Unauthorized: automatic token expiration or invalidation cleanup
    if (status === 401) {
      console.error('[apiClient] 401 Unauthorized detected - initiating session cleanup...');
      
      // Perform local cache cleanup
      await StorageService.removeItem(STORAGE_KEYS.FIREBASE_TOKEN);
      await StorageService.removeItem(STORAGE_KEYS.BACKEND_USER);
      await StorageService.removeItem(STORAGE_KEYS.AUTHENTICATED);

      // Trigger global logout callback (binds to Redux store/dispatch in store init)
      if (unauthorizedCallback) {
        unauthorizedCallback();
      }
    }

    return Promise.reject(error);
  }
);
