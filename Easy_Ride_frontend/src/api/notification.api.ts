import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { Notification, UnreadNotificationCount } from '../types/notification';

/**
 * Notifications API Queries and Mutations.
 * Injected dynamically into the global baseApi query middleware.
 */
export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Retrieves notifications history.
     * GET /notifications
     */
    getNotifications: builder.query<ApiResponse<Notification[]>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params: params ? { page: String(params.page || 1), limit: String(params.limit || 20) } : undefined,
      }),
      providesTags: ['Notifications'],
    }),

    /**
     * Fetch unread notification counts.
     * GET /notifications/unread-count
     */
    getUnreadCount: builder.query<ApiResponse<UnreadNotificationCount>, void>({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),

    /**
     * Mark a specific notification as read.
     * PUT /notifications/{id}/read
     */
    markNotificationRead: builder.mutation<ApiResponse<Notification>, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],

      // Optimistic Update to immediately toggle reading status and decrement the badge count
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        // Toggle flag in list query
        const patchList = dispatch(
          notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            if (draft?.data) {
              const target = draft.data.find((n) => n._id === notificationId);
              if (target && !target.isRead) {
                target.isRead = true;
              }
            }
          })
        );

        // Decrement badge count in unreadCount query
        const patchCount = dispatch(
          notificationApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
            if (draft?.data && draft.data.count > 0) {
              draft.data.count -= 1;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchCount.undo();
        }
      },
    }),

    /**
     * Mark all notifications as read.
     * PUT /notifications/read-all
     */
    markAllNotificationsRead: builder.mutation<ApiResponse<{}>, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],

      // Optimistic Update to immediately clear the badge count and mark all read in the cached list
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            if (draft?.data) {
              draft.data.forEach((n) => {
                n.isRead = true;
              });
            }
          })
        );

        const patchCount = dispatch(
          notificationApi.util.updateQueryData('getUnreadCount', undefined, (draft) => {
            if (draft?.data) {
              draft.data.count = 0;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchCount.undo();
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
