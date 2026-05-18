import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeAuth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential, 
  GoogleAuthProvider, 
  PhoneAuthProvider, 
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier
} from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../constants/env';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(ENV.FIREBASE_CONFIG) : getApp();

let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const firebaseAuth = auth;

/**
 * Enterprise Firebase Integration Service.
 * Centralizes all social logins, MFA (phone auth) flows, and token resolution helpers.
 */
export const FirebaseService = {
  /**
   * Listen to Firebase Auth state transitions.
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(firebaseAuth, callback);
  },

  waitForAuthInit(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  },

  async signUpWithEmailAndPassword(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('[FirebaseService] Email/Password registration failed:', error);
      throw error;
    }
  },

  async signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('[FirebaseService] Email/Password login failed:', error);
      throw error;
    }
  },

  /**
   * Retrieves the current user's Firebase ID Token, forcing a refresh if necessary.
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    try {
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('[FirebaseService] Error acquiring ID Token:', error);
      return null;
    }
  },

  /**
   * Initiates Google Sign-In preparation.
   * Resolves with the firebase credential on success.
   */
  async signInWithGoogleCredential(idToken: string, accessToken?: string): Promise<FirebaseUser> {
    try {
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(firebaseAuth, credential);
      return userCredential.user;
    } catch (error) {
      console.error('[FirebaseService] Google authentication failed:', error);
      throw error;
    }
  },

  /**
   * Prepares and starts the Phone OTP workflow.
   * Requires a recaptcha verifier container in the UI layer.
   */
  async startPhoneVerification(
    phoneNumber: string, 
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<any> {
    try {
      const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('[FirebaseService] Phone verification initiation failed:', error);
      throw error;
    }
  },

  /**
   * Confirms the phone verification code (OTP) and signs the user in.
   */
  async confirmPhoneOTP(confirmationResult: any, code: string): Promise<FirebaseUser> {
    try {
      const userCredential = await confirmationResult.confirm(code);
      return userCredential.user;
    } catch (error) {
      console.error('[FirebaseService] Phone verification code confirmation failed:', error);
      throw error;
    }
  },

  /**
   * Logs out from the Firebase client.
   */
  async logout(): Promise<void> {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('[FirebaseService] Sign-out failure:', error);
      throw error;
    }
  }
};
