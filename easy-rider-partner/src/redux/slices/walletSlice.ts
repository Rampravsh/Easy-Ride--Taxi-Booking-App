import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  balance: number;
  transactions: any[];
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
});

export const { setBalance } = walletSlice.actions;
export default walletSlice.reducer;
