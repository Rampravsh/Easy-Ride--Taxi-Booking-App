/**
 * Scalable API and integration constants.
 */

export const API_TIMEOUT = 15000; // 15 seconds request timeout

export const API_HEADERS = {
  JSON_CONTENT: 'application/json',
  MULTIPART_FORM: 'multipart/form-data',
};

/**
 * Storage keys utilized with AsyncStorage for session persistence.
 */
export const STORAGE_KEYS = {
  FIREBASE_TOKEN: '@easy_ride_firebase_token',
  BACKEND_USER: '@easy_ride_backend_user',
  AUTHENTICATED: '@easy_ride_authenticated',
};

/**
 * System API Endpoint registry. Decoupled to allow clean RTK Query mapping.
 */
export const API_ENDPOINTS = {
  AUTH: {
    FIREBASE: '/auth/firebase',
  },
  USER: {
    PROFILE: '/users/profile',
    DEVICE_TOKEN: '/users/device-token',
    PREFERENCES: '/users/preferences',
  },
};
