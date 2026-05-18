import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { Transaction } from '../types';

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTransactions: builder.query<
      ApiResponse<Transaction[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/transactions',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Wallet'],
    }),

    getTransactionById: builder.query<ApiResponse<Transaction>, string>({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Wallet', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyTransactionsQuery,
  useLazyGetMyTransactionsQuery,
  useGetTransactionByIdQuery,
} = transactionApi;
