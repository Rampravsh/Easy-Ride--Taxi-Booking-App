import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  emergencyMode: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: 'dark',
  emergencyMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setEmergencyMode: (state, action: PayloadAction<boolean>) => {
      state.emergencyMode = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setEmergencyMode } = uiSlice.actions;
export default uiSlice.reducer;
