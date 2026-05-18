import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '../../types/wallet';

interface WalletState {
  wallet: Wallet | null;
  balance: number;
  currency: string;
  isBlocked: boolean;
  isLoading: boolean;
}

const initialState: WalletState = {
  wallet: null,
  balance: 0,
  currency: 'INR',
  isBlocked: false,
  isLoading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet(state, action: PayloadAction<Wallet | null>) {
      state.wallet = action.payload;
      state.balance = action.payload?.balance ?? 0;
      state.currency = action.payload?.currency ?? 'INR';
      state.isBlocked = action.payload?.isBlocked ?? false;
    },
    updateBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
      if (state.wallet) {
        state.wallet.balance = action.payload;
      }
    },
    setWalletLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetWallet(state) {
      return initialState;
    },
  },
});

export const { setWallet, updateBalance, setWalletLoading, resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
