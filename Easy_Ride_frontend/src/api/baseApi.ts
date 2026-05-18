import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { apiClient } from './axios';
import { ApiErrorResponse } from '../types/api';

/**
 * Custom base query wrapper connecting our centralized Axios client with RTK Query.
 * Benefits: Uniform token injection, centralized error handling, and 401 logouts.
 */
export const axiosBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  },
  unknown,
  ApiErrorResponse
> =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<ApiErrorResponse>;
      
      const errorPayload: ApiErrorResponse = err.response?.data || {
        success: false,
        message: err.message || 'A network error occurred while contacting the server.',
      };

      return {
        error: errorPayload,
      };
    }
  };

/**
 * Enterprise Base API definition.
 * Serves as the foundation for the entire customer application.
 * Future domains (rides, chat, wallets, schedules) should inject their endpoints here.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'User',
    'Rides',
    'Wallet',
    'Notifications',
    'Chat',
    'Payments',
    'Schedules',
  ],
  endpoints: () => ({}), // Endpoints will be injected by modular domain APIs
});
