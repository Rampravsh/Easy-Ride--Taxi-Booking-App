import { baseApi } from './baseApi';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ApiResponse } from '../types/api';
import { BackendUser, FirebaseAuthPayload, UserRole, UserPreferences } from '../types/auth';

/**
 * Authentication and User Profile API Endpoints.
 * Injected dynamically into the global baseApi query layer.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Exchanges Firebase ID Token for a backend user profile.
     * POST /auth/firebase
     */
    loginWithFirebase: builder.mutation<ApiResponse<BackendUser>, FirebaseAuthPayload>({
      query: (payload) => ({
        url: API_ENDPOINTS.AUTH.FIREBASE,
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Retrieves the current user's profile metadata.
     * GET /users/profile
     */
    getUserProfile: builder.query<ApiResponse<BackendUser>, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /**
     * Updates passenger profile details (full name, email, phone, avatar).
     * PUT /users/profile
     */
    updateUserProfile: builder.mutation<
      ApiResponse<BackendUser>,
      Partial<Pick<BackendUser, 'fullName' | 'email' | 'phone' | 'profileImage'>>
    >({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Binds a Firebase Cloud Messaging push token for notifications.
     * PUT /users/device-token
     */
    updateDeviceToken: builder.mutation<ApiResponse<BackendUser>, { token: string }>({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.DEVICE_TOKEN,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Gets user preferences (push notification toggles, language, theme).
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
     * Updates user preferences (push notification toggles, language, theme).
     * PUT /users/preferences
     */
    updateUserPreferences: builder.mutation<ApiResponse<BackendUser>, Partial<UserPreferences>>({
      query: (payload) => ({
        url: API_ENDPOINTS.USER.PREFERENCES,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginWithFirebaseMutation,
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateDeviceTokenMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
} = authApi;
