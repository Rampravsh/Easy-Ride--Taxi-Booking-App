import { baseApi } from './baseApi';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ApiResponse } from '../types/api';
import { UserProfile, SavedAddress, UserPreferences } from '../types/user';

/**
 * User Profile & Passenger settings API Queries and Mutations.
 * Injected dynamically into the global baseApi query middleware.
 */
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch complete passenger profile details.
     * GET /users/profile
     */
    getUserProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /**
     * Edit user profile information (fullName, email, phone).
     * PUT /users/profile
     */
    updateUserProfile: builder.mutation<
      ApiResponse<UserProfile>,
      Partial<Pick<UserProfile, 'fullName' | 'email' | 'phone' | 'profileImage'>>
    >({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Upload profile picture avatar.
     * POST /users/profile-image
     */
    uploadProfileImage: builder.mutation<ApiResponse<UserProfile>, FormData>({
      query: (formData) => ({
        url: `${API_ENDPOINTS.USER.PROFILE}-image`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Add saved shortcut address (e.g. Work, Gym).
     * POST /users/address
     */
    addUserAddress: builder.mutation<
      ApiResponse<UserProfile>,
      Pick<SavedAddress, 'label' | 'address'> & { coordinates: [number, number] }
    >({
      query: (payload) => ({
        url: '/users/address',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Remove a saved shortcut address by its MongoDB object identifier.
     * DELETE /users/address/{id}
     */
    deleteUserAddress: builder.mutation<ApiResponse<UserProfile>, string>({
      query: (addressId) => ({
        url: `/users/address/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],

      // Optimistic Update implementation to make deleting addresses feel instantaneous
      async onQueryStarted(addressId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUserProfile', undefined, (draft) => {
            if (draft?.data?.savedAddresses) {
              draft.data.savedAddresses = draft.data.savedAddresses.filter(
                (addr) => addr._id !== addressId
              );
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

    /**
     * Fetch user notifications and language preferences.
     * GET /users/preferences
     */
    getUserPreferences: builder.query<ApiResponse<UserPreferences>, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.PREFERENCES,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /**
     * Edit notification toggles, theme, and language preferences.
     * PUT /users/preferences
     */
    updateUserPreferences: builder.mutation<ApiResponse<UserProfile>, Partial<UserPreferences>>({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.PREFERENCES,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['User'],

      // Optimistic Update for settings toggles to prevent network delay stutter in switches
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUserProfile', undefined, (draft) => {
            if (draft?.data) {
              draft.data.preferences = {
                notifications: {
                  push: payload.notifications?.push ?? draft.data.preferences?.notifications?.push ?? true,
                  email: payload.notifications?.email ?? draft.data.preferences?.notifications?.email ?? false,
                  sms: payload.notifications?.sms ?? draft.data.preferences?.notifications?.sms ?? false,
                },
                language: payload.language ?? draft.data.preferences?.language ?? 'en',
                theme: payload.theme ?? draft.data.preferences?.theme ?? 'light',
              } as UserPreferences;
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

    /**
     * Bind securely a new Firebase Cloud Messaging device push token.
     * PUT /users/device-token
     */
    updateDeviceToken: builder.mutation<ApiResponse<UserProfile>, { token: string }>({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.DEVICE_TOKEN,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadProfileImageMutation,
  useAddUserAddressMutation,
  useDeleteUserAddressMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useUpdateDeviceTokenMutation,
} = userApi;
