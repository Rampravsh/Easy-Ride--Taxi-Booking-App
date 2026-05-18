import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import {
  Ride,
  RideEstimateRequest,
  RideEstimateResponse,
  RideBookingPayload,
} from '../types/ride';

/**
 * Ride booking, estimation, details, and cancellation REST queries and mutations.
 * Injected dynamically into the global baseApi query middleware.
 */
export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Calculate estimated pricing, distance, duration for a ride configuration.
     * POST /rides/estimate
     */
    getRideEstimate: builder.mutation<ApiResponse<RideEstimateResponse>, RideEstimateRequest>({
      query: (payload) => {
        const mappedType = payload.rideType === 'cab' ? 'car' : payload.rideType;
        let mappedCategory = payload.rideCategory;
        if (payload.rideCategory === 'saver') {
          mappedCategory = 'economy';
        } else if (payload.rideCategory === 'luxury') {
          mappedCategory = 'premium';
        }
        return {
          url: '/rides/estimate',
          method: 'POST',
          data: {
            ...payload,
            rideType: mappedType,
            rideCategory: mappedCategory,
          },
        };
      },
    }),

    /**
     * Book a new ride request and put it in SEARCHING state.
     * POST /rides/book
     */
    bookRide: builder.mutation<ApiResponse<Ride>, RideBookingPayload>({
      query: (payload) => {
        const mappedType = payload.rideType === 'cab' ? 'car' : payload.rideType;
        let mappedCategory = payload.rideCategory;
        if (payload.rideCategory === 'saver') {
          mappedCategory = 'economy';
        } else if (payload.rideCategory === 'luxury') {
          mappedCategory = 'premium';
        }
        return {
          url: '/rides/book',
          method: 'POST',
          data: {
            ...payload,
            rideType: mappedType,
            rideCategory: mappedCategory,
          },
        };
      },
      invalidatesTags: ['Rides'],
    }),

    /**
     * Retrieve complete real-time details of a ride.
     * GET /rides/{rideId}
     */
    getRideDetails: builder.query<ApiResponse<Ride>, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}`,
        method: 'GET',
      }),
      providesTags: (result, error, rideId) => [
        { type: 'Rides', id: rideId },
        { type: 'Rides', id: 'ACTIVE' },
      ],
    }),

    /**
     * Cancel an active ride request prior to trip starting.
     * PUT /rides/{rideId}/cancel
     */
    cancelRide: builder.mutation<ApiResponse<Ride>, { rideId: string; reason: string }>({
      query: ({ rideId, reason }) => ({
        url: `/rides/${rideId}/cancel`,
        method: 'PUT',
        data: { reason },
      }),
      invalidatesTags: (result, error, { rideId }) => [
        { type: 'Rides', id: rideId },
        { type: 'Rides', id: 'ACTIVE' },
        'Rides',
      ],

      // Optimistic updates for clean, snappy cancellation feedback in UI
      async onQueryStarted({ rideId, reason }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          rideApi.util.updateQueryData('getRideDetails', rideId, (draft) => {
            if (draft?.data) {
              draft.data.status = 'cancelled';
              draft.data.cancelledAt = new Date().toISOString();
              draft.data.cancelledByModel = 'User';
              draft.data.cancellationReason = reason;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetRideEstimateMutation,
  useBookRideMutation,
  useGetRideDetailsQuery,
  useLazyGetRideDetailsQuery,
  useCancelRideMutation,
} = rideApi;
