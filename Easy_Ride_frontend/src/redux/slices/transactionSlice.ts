import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  page: 1,
  hasMore: true,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
    appendTransactions(state, action: PayloadAction<Transaction[]>) {
      // Append unique transactions to avoid duplicates
      const newTxIds = new Set(action.payload.map(tx => tx._id));
      const existingFiltered = state.transactions.filter(tx => !newTxIds.has(tx._id));
      state.transactions = [...existingFiltered, ...action.payload];
    },
    setTransactionLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setTransactionPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setHasMoreTransactions(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    resetTransactions(state) {
      return initialState;
    },
  },
});

export const {
  setTransactions,
  appendTransactions,
  setTransactionLoading,
  setTransactionPage,
  setHasMoreTransactions,
  resetTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
