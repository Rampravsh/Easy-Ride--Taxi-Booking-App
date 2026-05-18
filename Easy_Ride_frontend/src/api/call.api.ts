import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { CallRecord } from '../types/call';

export const callApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Initiate a new audio or video call for a ride.
     * POST /calls/initiate
     */
    initiateCall: builder.mutation<ApiResponse<{ call: CallRecord; token: string }>, { rideId: string; callType: 'audio' | 'video' }>({
      query: (body) => ({
        url: '/calls/initiate',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Payments'], // Invalidate list tags if necessary
    }),

    /**
     * Accept an incoming call.
     * POST /calls/{callId}/accept
     */
    acceptCall: builder.mutation<ApiResponse<{ token: string }>, string>({
      query: (callId) => ({
        url: `/calls/${callId}/accept`,
        method: 'POST',
      }),
    }),

    /**
     * Reject an incoming call.
     * POST /calls/{callId}/reject
     */
    rejectCall: builder.mutation<ApiResponse<{}>, string>({
      query: (callId) => ({
        url: `/calls/${callId}/reject`,
        method: 'POST',
      }),
    }),

    /**
     * Terminate an active call session.
     * POST /calls/{callId}/end
     */
    endCall: builder.mutation<ApiResponse<{}>, string>({
      query: (callId) => ({
        url: `/calls/${callId}/end`,
        method: 'POST',
      }),
    }),

    /**
     * Retrieve voice and video call log history.
     * GET /calls/history
     */
    getCallHistory: builder.query<ApiResponse<CallRecord[]>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/calls/history',
        method: 'GET',
        params: params ? { page: String(params.page || 1), limit: String(params.limit || 20) } : undefined,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitiateCallMutation,
  useAcceptCallMutation,
  useRejectCallMutation,
  useEndCallMutation,
  useGetCallHistoryQuery,
} = callApi;
