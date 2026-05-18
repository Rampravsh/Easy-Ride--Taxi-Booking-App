import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';

export const complainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Submit a customer support complaint/grievance regarding a ride or vehicle.
     * POST /users/complaints
     */
    submitComplaint: builder.mutation<
      ApiResponse<{}>,
      { reason: string; description: string; rideId?: string }
    >({
      query: (body) => ({
        url: '/users/complaints',
        method: 'POST',
        data: body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useSubmitComplaintMutation } = complainApi;
export default complainApi;
