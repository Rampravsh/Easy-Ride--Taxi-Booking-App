import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isForeground: boolean;
  globalLoading: boolean;
  loadingMessage: string | null;
  fatalError: string | null;
  maintenanceMode: boolean;
  toast: {
    message: string | null;
    type: 'success' | 'error' | 'info' | null;
    duration?: number;
  } | null;
}

const initialState: AppState = {
  isForeground: true,
  globalLoading: false,
  loadingMessage: null,
  fatalError: null,
  maintenanceMode: false,
  toast: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<boolean>) => {
      state.isForeground = action.payload;
    },
    showGlobalLoader: (state, action: PayloadAction<string | null>) => {
      state.globalLoading = true;
      state.loadingMessage = action.payload;
    },
    hideGlobalLoader: (state) => {
      state.globalLoading = false;
      state.loadingMessage = null;
    },
    setFatalError: (state, action: PayloadAction<string | null>) => {
      state.fatalError = action.payload;
    },
    setMaintenanceMode: (state, action: PayloadAction<boolean>) => {
      state.maintenanceMode = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info'; duration?: number }>
    ) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setAppState,
  showGlobalLoader,
  hideGlobalLoader,
  setFatalError,
  setMaintenanceMode,
  showToast,
  hideToast,
} = appSlice.actions;

export default appSlice.reducer;
