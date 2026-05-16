import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RiderState {
  isOnline: boolean;
  status: 'available' | 'busy' | 'offline';
  currentLocation: {
    latitude: number;
    longitude: number;
    heading: number;
  } | null;
  earnings: {
    today: number;
    weekly: number;
    total: number;
  };
}

const initialState: RiderState = {
  isOnline: false,
  status: 'offline',
  currentLocation: null,
  earnings: {
    today: 0,
    weekly: 0,
    total: 0,
  },
};

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      state.status = action.payload ? 'available' : 'offline';
    },
    updateLocation: (state, action: PayloadAction<RiderState['currentLocation']>) => {
      state.currentLocation = action.payload;
    },
    updateEarnings: (state, action: PayloadAction<Partial<RiderState['earnings']>>) => {
      state.earnings = { ...state.earnings, ...action.payload };
    },
  },
});

export const { setOnlineStatus, updateLocation, updateEarnings } = riderSlice.actions;
export default riderSlice.reducer;
