import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Enterprise Application Environment Configurations
 */

// Retrieve system host for local bundler to automatically connect physical devices to local backend
const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
const devHost = debuggerHost ? `http://${debuggerHost}:5000/api/v1` : null;

export const ENV = {
  // Toggle to override production environments
  IS_DEVELOPMENT: __DEV__,

  // Default API configuration with platform-specific localhost fallbacks and dynamic bundler IP checks
  API_BASE_URL: __DEV__
    ? devHost || (Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1')
    : process.env.EXPO_PUBLIC_API_BASE_URL_PROD || 'https://api.easyride.com/api/v1',

  // Firebase Configurations securely loaded from loaded environment variables
  FIREBASE_CONFIG: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || ''
  }
};
