import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentOrder, PromoValidation } from '../../types';

export type PaymentStateStatus = 'idle' | 'creating' | 'processing' | 'verifying' | 'success' | 'failed';
export type RidePaymentStatus = 'unpaid' | 'pending' | 'paid';

interface PaymentState {
  activePaymentState: PaymentStateStatus;
  lastOrder: PaymentOrder | null;
  ridePaymentStatus: RidePaymentStatus;
  appliedPromo: PromoValidation | null;
  paymentError: string | null;
  selectedPaymentMethod: 'wallet' | 'cash' | 'card';
}

const initialState: PaymentState = {
  activePaymentState: 'idle',
  lastOrder: null,
  ridePaymentStatus: 'unpaid',
  appliedPromo: null,
  paymentError: null,
  selectedPaymentMethod: 'wallet',
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentStateStatus(state, action: PayloadAction<PaymentStateStatus>) {
      state.activePaymentState = action.payload;
    },
    setLastOrder(state, action: PayloadAction<PaymentOrder | null>) {
      state.lastOrder = action.payload;
    },
    setRidePaymentStatus(state, action: PayloadAction<RidePaymentStatus>) {
      state.ridePaymentStatus = action.payload;
    },
    setAppliedPromo(state, action: PayloadAction<PromoValidation | null>) {
      state.appliedPromo = action.payload;
    },
    setPaymentError(state, action: PayloadAction<string | null>) {
      state.paymentError = action.payload;
    },
    setSelectedPaymentMethod(state, action: PayloadAction<'wallet' | 'cash' | 'card'>) {
      state.selectedPaymentMethod = action.payload;
    },
    resetPaymentState(state) {
      return initialState;
    },
  },
});

export const {
  setPaymentStateStatus,
  setLastOrder,
  setRidePaymentStatus,
  setAppliedPromo,
  setPaymentError,
  setSelectedPaymentMethod,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
