import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QueuedRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  retryCount: number;
  maxRetries: number;
  timestamp: number;
}

export interface NetworkState {
  isOnline: boolean;
  connectionType: string | null;
  isReconnecting: boolean;
  retryQueue: QueuedRequest[];
}

const initialState: NetworkState = {
  isOnline: true,
  connectionType: 'unknown',
  isReconnecting: false,
  retryQueue: [],
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setConnectionStatus: (
      state,
      action: PayloadAction<{ isOnline: boolean; connectionType: string | null }>
    ) => {
      state.isOnline = action.payload.isOnline;
      state.connectionType = action.payload.connectionType;
      if (action.payload.isOnline) {
        state.isReconnecting = false;
      }
    },
    setReconnecting: (state, action: PayloadAction<boolean>) => {
      state.isReconnecting = action.payload;
    },
    addToRetryQueue: (state, action: PayloadAction<Omit<QueuedRequest, 'retryCount' | 'timestamp'>>) => {
      const alreadyExists = state.retryQueue.some((req) => req.id === action.payload.id);
      if (!alreadyExists) {
        state.retryQueue.push({
          ...action.payload,
          retryCount: 0,
          timestamp: Date.now(),
        });
      }
    },
    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const request = state.retryQueue.find((req) => req.id === action.payload);
      if (request) {
        request.retryCount += 1;
      }
    },
    removeFromRetryQueue: (state, action: PayloadAction<string>) => {
      state.retryQueue = state.retryQueue.filter((req) => req.id !== action.payload);
    },
    clearRetryQueue: (state) => {
      state.retryQueue = [];
    },
  },
});

export const {
  setConnectionStatus,
  setReconnecting,
  addToRetryQueue,
  incrementRetryCount,
  removeFromRetryQueue,
  clearRetryQueue,
} = networkSlice.actions;

export default networkSlice.reducer;
