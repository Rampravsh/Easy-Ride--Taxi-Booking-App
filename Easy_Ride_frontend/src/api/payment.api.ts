import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { PaymentOrder, RazorpayVerificationPayload, Transaction } from '../types';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTopupOrder: builder.mutation<ApiResponse<PaymentOrder>, { amount: number }>({
      query: (payload) => ({
        url: '/payments/create-order',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Payments'],
    }),

    verifyTopupPayment: builder.mutation<
      ApiResponse<{ success: boolean; transaction: Transaction }>,
      RazorpayVerificationPayload
    >({
      query: (payload) => ({
        url: '/payments/verify',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Payments', 'Wallet'],
    }),

    refundPayment: builder.mutation<
      ApiResponse<{ success: boolean }>,
      { transactionId: string; amount?: number; reason?: string }
    >({
      query: (payload) => ({
        url: '/payments/refund',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Payments', 'Wallet'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateTopupOrderMutation,
  useVerifyTopupPaymentMutation,
  useRefundPaymentMutation,
} = paymentApi;
