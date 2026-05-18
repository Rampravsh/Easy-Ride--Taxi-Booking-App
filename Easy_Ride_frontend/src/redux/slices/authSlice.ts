import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, BackendUser, UserRole } from '../../types/auth';
import { AuthService } from '../../services/auth.service';

const initialState: AuthState = {
  firebaseUser: null,
  firebaseToken: null,
  backendUser: null,
  authenticated: false,
  initialized: false,
  loading: false,
  error: null,
};

/**
 * Thunk to verify and restore active cached sessions on app startup.
 */
export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await AuthService.restoreSession();
      if (!session) {
        return rejectWithValue('No cached session found');
      }
      return session;
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
  },
  extraReducers: (builder) => {
    // 1. Session Restoration
    builder.addCase(restoreSessionThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.firebaseToken = action.payload.token;
      state.backendUser = action.payload.user;
      state.authenticated = true;
      state.initialized = true;
      state.loading = false;
    });
    builder.addCase(restoreSessionThunk.rejected, (state) => {
      state.initialized = true;
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

export const { setFirebaseUser, setFirebaseToken, setBackendUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
