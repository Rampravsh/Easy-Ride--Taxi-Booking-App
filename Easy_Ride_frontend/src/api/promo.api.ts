import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { Promo, PromoValidation } from '../types';

export interface PromoPayload {
  code: string;
  rideType: string;
  city: string;
  fare: number;
}

export const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validatePromo: builder.mutation<ApiResponse<Promo>, PromoPayload>({
      query: (payload) => ({
        url: '/promos/validate',
        method: 'POST',
        data: payload,
      }),
    }),

    applyPromo: builder.mutation<ApiResponse<PromoValidation>, PromoPayload>({
      query: (payload) => ({
        url: '/promos/apply',
        method: 'POST',
        data: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useValidatePromoMutation, useApplyPromoMutation } = promoApi;
