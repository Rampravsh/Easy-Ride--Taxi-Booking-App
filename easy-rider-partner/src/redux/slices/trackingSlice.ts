import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrackingState {
  currentPosition: any | null;
  path: any[];
}

const initialState: TrackingState = {
  currentPosition: null,
  path: [],
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    updatePosition: (state, action: PayloadAction<any>) => {
      state.currentPosition = action.payload;
      state.path.push(action.payload);
    },
  },
});

export const { updatePosition } = trackingSlice.actions;
export default trackingSlice.reducer;
