import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer, { logoutThunk } from './slices/authSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import rideReducer from './slices/rideSlice';
import socketReducer from './slices/socketSlice';
import walletReducer from './slices/walletSlice';
import paymentReducer from './slices/paymentSlice';
import transactionReducer from './slices/transactionSlice';
import { baseApi } from '../api/baseApi';
import { registerUnauthorizedHandler } from '../api/axios';

/**
 * Enterprise Redux Store configuration.
 * Consolidates standard auth, user profile, notification reducers, and RTK Query API middlewares.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    ride: rideReducer,
    socket: socketReducer,
    wallet: walletReducer,
    payment: paymentReducer,
    transaction: transactionReducer,
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
