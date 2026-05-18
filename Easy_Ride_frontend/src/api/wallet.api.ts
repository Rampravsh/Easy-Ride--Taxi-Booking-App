import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { Wallet, Transaction } from '../types';

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<ApiResponse<Wallet>, void>({
      query: () => ({
        url: '/wallet',
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),

    getWalletTransactions: builder.query<
      ApiResponse<Transaction[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/wallet/transactions',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Wallet'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWalletQuery, useLazyGetWalletQuery, useGetWalletTransactionsQuery } = walletApi;
