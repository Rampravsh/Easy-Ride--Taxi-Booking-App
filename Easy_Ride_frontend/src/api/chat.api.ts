import { baseApi } from './baseApi';
import { ApiResponse } from '../types/api';
import { ChatMessage } from '../types/chat';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Retrieve chat history for a specific ride.
     * GET /chat/{rideId}/messages
     */
    getMessages: builder.query<ApiResponse<ChatMessage[]>, { rideId: string; limit?: number; lastCreatedAt?: string }>({
      query: ({ rideId, limit, lastCreatedAt }) => ({
        url: `/chat/${rideId}/messages`,
        method: 'GET',
        params: {
          limit: limit ? String(limit) : '50',
          ...(lastCreatedAt ? { lastCreatedAt } : {}),
        },
      }),
      providesTags: (result, error, { rideId }) => [{ type: 'Chat', id: rideId }],
    }),

    /**
     * Fetch the overall unread chat message count.
     * GET /chat/unread-count
     */
    getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => ({
        url: '/chat/unread-count',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),

    /**
     * Send a new chat message.
     * POST /chat/send
     */
    sendMessage: builder.mutation<ApiResponse<ChatMessage>, { rideId: string; content: string; messageType?: string; metadata?: any }>({
      query: (body) => ({
        url: '/chat/send',
        method: 'POST',
        data: body,
      }),
      // Optimistic update to immediately insert the message into the local cache list
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        // Create a temporary ID for the optimistic message
        const tempId = 'temp_' + Date.now();
        const state = (dispatch as any)((_: any, getState: any) => getState());
        // Retrieve current user ID from the auth slice to mark as sender
        const currentUserId = state?.auth?.user?._id || 'me';

        const optimisticMessage: ChatMessage = {
          _id: tempId,
          ride: args.rideId,
          sender: currentUserId,
          receiver: '', // will be resolved by backend
          content: args.content,
          messageType: (args.messageType || 'text') as any,
          status: 'sent',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages', { rideId: args.rideId }, (draft) => {
            if (draft?.data) {
              draft.data.unshift(optimisticMessage); // Add to the top (or push depending on ordering, FlatList uses inverted usually)
            } else {
              draft.data = [optimisticMessage];
            }
          })
        );

        try {
          const { data: response } = await queryFulfilled;
          // Replace optimistic message with actual backend response message
          dispatch(
            chatApi.util.updateQueryData('getMessages', { rideId: args.rideId }, (draft) => {
              if (draft?.data) {
                const index = draft.data.findIndex((msg) => msg._id === tempId);
                if (index !== -1 && response?.data) {
                  draft.data[index] = response.data;
                }
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    /**
     * Mark all messages for a specific ride as read.
     * PUT /chat/{rideId}/read
     */
    markAsRead: builder.mutation<ApiResponse<{}>, string>({
      query: (rideId) => ({
        url: `/chat/${rideId}/read`,
        method: 'PUT',
      }),
      // Optimistic update to immediately mark unread messages in the cache as read
      async onQueryStarted(rideId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages', { rideId }, (draft) => {
            if (draft?.data) {
              draft.data.forEach((msg) => {
                if (msg.status !== 'read') {
                  msg.status = 'read';
                }
              });
            }
          })
        );

        try {
          await queryFulfilled;
          // Invalidate/refetch unread counts to keep badge count in sync
          dispatch(chatApi.util.invalidateTags(['Chat']));
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMessagesQuery,
  useGetUnreadCountQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = chatApi;
