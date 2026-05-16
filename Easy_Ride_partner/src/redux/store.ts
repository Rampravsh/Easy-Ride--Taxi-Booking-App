import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add your reducers here as you create slices
  },
  // Middleware configuration for RTK Query can be added here later
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
