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
    : 'https://api.easyride.com/api/v1', // Replace with real production domain when launching

  // Firebase Configurations (can be wired to expo-constants/dotenv later)
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyFakeKey-ForSetupOnly-ReplaceWithReal",
    authDomain: "easy-ride-auth.firebaseapp.com",
    projectId: "easy-ride-auth",
    storageBucket: "easy-ride-auth.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
  }
};
