import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RideState {
  currentRide: any | null;
  history: any[];
  isLoading: boolean;
}

const initialState: RideState = {
  currentRide: null,
  history: [],
  isLoading: false,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRide: (state, action: PayloadAction<any>) => {
      state.currentRide = action.payload;
    },
    clearRide: (state) => {
      state.currentRide = null;
    },
    setHistory: (state, action: PayloadAction<any[]>) => {
      state.history = action.payload;
    },
  },
});

export const { setRide, clearRide, setHistory } = rideSlice.actions;
export default rideSlice.reducer;
