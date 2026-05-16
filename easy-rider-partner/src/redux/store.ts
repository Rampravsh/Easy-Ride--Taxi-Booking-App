import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import riderReducer from './slices/riderSlice';
import rideReducer from './slices/rideSlice';
import earningsReducer from './slices/earningsSlice';
import walletReducer from './slices/walletSlice';
import notificationReducer from './slices/notificationSlice';
import trackingReducer from './slices/trackingSlice';
import socketReducer from './slices/socketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
    ride: rideReducer,
    earnings: earningsReducer,
    wallet: walletReducer,
    notifications: notificationReducer,
    tracking: trackingReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
