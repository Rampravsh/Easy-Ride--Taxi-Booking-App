import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, BackendUser, UserRole } from '../../types/auth';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from '../../constants/api.constants';

const initialState: AuthState = {
  firebaseUser: null,
  firebaseToken: null,
  backendUser: null,
  authenticated: false,
  initialized: false,
  loading: false,
  error: null,
  onboardingCompleted: false,
  locationPermissionGranted: false,
  notificationPermissionGranted: false,
  biometricEnabled: false,
  hydrated: false,
};

/**
 * Thunk to verify and restore active cached sessions on app startup.
 */
export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await AuthService.restoreSession();
      const onboardingCompleted = await StorageService.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED) || false;
      const locationPermissionGranted = await StorageService.getItem<boolean>(STORAGE_KEYS.LOCATION_GRANTED) || false;
      const notificationPermissionGranted = await StorageService.getItem<boolean>(STORAGE_KEYS.NOTIFICATION_GRANTED) || false;
      const biometricEnabled = await StorageService.getItem<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED) || false;

      return {
        session,
        onboardingCompleted,
        locationPermissionGranted,
        notificationPermissionGranted,
        biometricEnabled,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to restore session');
    }
  }
);

/**
 * Thunk to synchronize Firebase credential with backend database user profile.
 * Aligned with POST /auth/firebase.
 */
export const loginWithFirebaseThunk = createAsyncThunk(
  'auth/loginWithFirebase',
  async (
    payload: { token: string; role: UserRole; firebaseUser: any },
    { rejectWithValue }
  ) => {
    try {
      const backendUser = await AuthService.syncBackendAuth(payload.token, payload.role);
      return {
        token: payload.token,
        backendUser,
        firebaseUser: payload.firebaseUser,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to synchronize with backend server');
    }
  }
);

/**
 * Thunk to perform complete user logout cleanup.
 */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clean up authentication sessions');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFirebaseUser(state, action: PayloadAction<any>) {
      state.firebaseUser = action.payload;
      if (!action.payload) {
        state.firebaseToken = null;
        state.backendUser = null;
        state.authenticated = false;
      }
    },
    setFirebaseToken(state, action: PayloadAction<string | null>) {
      state.firebaseToken = action.payload;
    },
    setBackendUser(state, action: PayloadAction<BackendUser | null>) {
      state.backendUser = action.payload;
      state.authenticated = !!action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setOnboardingCompleted(state, action: PayloadAction<boolean>) {
      state.onboardingCompleted = action.payload;
      StorageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, action.payload);
    },
    setLocationPermissionGranted(state, action: PayloadAction<boolean>) {
      state.locationPermissionGranted = action.payload;
      StorageService.setItem(STORAGE_KEYS.LOCATION_GRANTED, action.payload);
    },
    setNotificationPermissionGranted(state, action: PayloadAction<boolean>) {
      state.notificationPermissionGranted = action.payload;
      StorageService.setItem(STORAGE_KEYS.NOTIFICATION_GRANTED, action.payload);
    },
    setBiometricEnabled(state, action: PayloadAction<boolean>) {
      state.biometricEnabled = action.payload;
      StorageService.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, action.payload);
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 1. Session Restoration
    builder.addCase(restoreSessionThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      if (action.payload.session) {
        state.firebaseToken = action.payload.session.token;
        state.backendUser = action.payload.session.user;
        state.authenticated = true;
      }
      state.onboardingCompleted = action.payload.onboardingCompleted;
      state.locationPermissionGranted = action.payload.locationPermissionGranted;
      state.notificationPermissionGranted = action.payload.notificationPermissionGranted;
      state.biometricEnabled = action.payload.biometricEnabled;
      state.initialized = true;
      state.hydrated = true;
      state.loading = false;
    });
    builder.addCase(restoreSessionThunk.rejected, (state) => {
      state.initialized = true;
      state.hydrated = true;
      state.loading = false;
    });

    // 2. Firebase Sync login
    builder.addCase(loginWithFirebaseThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginWithFirebaseThunk.fulfilled, (state, action) => {
      state.firebaseUser = action.payload.firebaseUser;
      state.firebaseToken = action.payload.token;
      state.backendUser = action.payload.backendUser;
      state.authenticated = true;
      state.loading = false;
    });
    builder.addCase(loginWithFirebaseThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 3. Logout
    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.firebaseUser = null;
      state.firebaseToken = null;
      state.backendUser = null;
      state.authenticated = false;
      state.loading = false;
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      // Force clean state regardless of server/sdk failure
      state.firebaseUser = null;
      state.firebaseToken = null;
      state.backendUser = null;
      state.authenticated = false;
      state.loading = false;
    });
  },
});

export const {
  setFirebaseUser,
  setFirebaseToken,
  setBackendUser,
  clearAuthError,
  setOnboardingCompleted,
  setLocationPermissionGranted,
  setNotificationPermissionGranted,
  setBiometricEnabled,
  setHydrated,
} = authSlice.actions;
export default authSlice.reducer;
