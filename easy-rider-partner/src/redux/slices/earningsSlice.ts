import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EarningsState {
  today: number;
  weekly: number;
  total: number;
  recentTrips: any[];
}

const initialState: EarningsState = {
  today: 0,
  weekly: 0,
  total: 0,
  recentTrips: [],
};

const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    setEarnings: (state, action: PayloadAction<Partial<EarningsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setEarnings } = earningsSlice.actions;
export default earningsSlice.reducer;
