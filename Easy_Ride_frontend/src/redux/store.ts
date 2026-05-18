import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer, { logoutThunk } from './slices/authSlice';
import { baseApi } from '../api/baseApi';
import { registerUnauthorizedHandler } from '../api/axios';

/**
 * Enterprise Redux Store configuration.
 * Consolidates standard auth reducers and RTK Query API middlewares.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore firebaseUser class instances which might contain non-serializable fields
        ignoredActions: [
          'auth/loginWithFirebase/fulfilled',
          'auth/setFirebaseUser',
        ],
        ignoredPaths: ['auth.firebaseUser'],
      },
    }).concat(baseApi.middleware),
});

// Setup listeners for RTK Query refetchOnFocus and refetchOnReconnect capabilities
setupListeners(store.dispatch);

// Bind the Axios unauthorized (401) interceptor to trigger a clean store logout
registerUnauthorizedHandler(() => {
  store.dispatch(logoutThunk());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
