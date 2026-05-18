import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { RideReview } from '../types';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<
      ApiResponse<RideReview>,
      { rideId: string; receiverId: string; rating: number; comment?: string }
    >({
      query: (payload) => ({
        url: '/reviews',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Rides'],
    }),

    getRideReviews: builder.query<ApiResponse<RideReview[]>, string>({
      query: (rideId) => ({
        url: `/reviews/ride/${rideId}`,
        method: 'GET',
      }),
      providesTags: (result, error, rideId) => [{ type: 'Rides', id: rideId }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateReviewMutation, useGetRideReviewsQuery } = reviewApi;
