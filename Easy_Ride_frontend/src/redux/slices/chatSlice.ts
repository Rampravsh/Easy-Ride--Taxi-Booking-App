import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, Message } from '../../types/chat';

interface ChatState {
  // Messages indexed by rideId
  activeChats: { [rideId: string]: ChatMessage[] };
  // Unread message count indexed by rideId
  unreadCounts: { [rideId: string]: number };
  // Overall unread chat message count
  totalUnreadCount: number;
  // Typing indicators indexed by rideId, and then by userId
  typingIndicators: { [rideId: string]: { [userId: string]: boolean } };
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  activeChats: {},
  unreadCounts: {},
  totalUnreadCount: 0,
  typingIndicators: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatMessages(state, action: PayloadAction<{ rideId: string; messages: ChatMessage[] }>) {
      const { rideId, messages } = action.payload;
      state.activeChats[rideId] = messages;
    },
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      const msg = action.payload;
      const rideId = msg.ride;
      if (!state.activeChats[rideId]) {
        state.activeChats[rideId] = [];
      }
      // Check if message already exists (from optimistic updates)
      const existingIdx = state.activeChats[rideId].findIndex((m) => m._id === msg._id);
      if (existingIdx !== -1) {
        state.activeChats[rideId][existingIdx] = msg;
      } else {
        state.activeChats[rideId].unshift(msg); // Add to the top of the list (newest first)
      }
    },
    updateChatMessageStatus(state, action: PayloadAction<{ rideId: string; messageId: string; status: ChatMessage['status'] }>) {
      const { rideId, messageId, status } = action.payload;
      const chat = state.activeChats[rideId];
      if (chat) {
        const msg = chat.find((m) => m._id === messageId);
        if (msg) {
          msg.status = status;
        }
      }
    },
    setRideUnreadCount(state, action: PayloadAction<{ rideId: string; count: number }>) {
      const { rideId, count } = action.payload;
      state.unreadCounts[rideId] = count;
      state.totalUnreadCount = Object.values(state.unreadCounts).reduce((acc, curr) => acc + curr, 0);
    },
    incrementRideUnreadCount(state, action: PayloadAction<string>) {
      const rideId = action.payload;
      state.unreadCounts[rideId] = (state.unreadCounts[rideId] || 0) + 1;
      state.totalUnreadCount += 1;
    },
    clearRideUnreadCount(state, action: PayloadAction<string>) {
      const rideId = action.payload;
      const prev = state.unreadCounts[rideId] || 0;
      state.unreadCounts[rideId] = 0;
      state.totalUnreadCount = Math.max(0, state.totalUnreadCount - prev);
    },
    setTotalUnreadCount(state, action: PayloadAction<number>) {
      state.totalUnreadCount = action.payload;
    },
    setUserTyping(state, action: PayloadAction<{ rideId: string; userId: string; isTyping: boolean }>) {
      const { rideId, userId, isTyping } = action.payload;
      if (!state.typingIndicators[rideId]) {
        state.typingIndicators[rideId] = {};
      }
      state.typingIndicators[rideId][userId] = isTyping;
    },
    clearTypingIndicators(state, action: PayloadAction<string>) {
      const rideId = action.payload;
      delete state.typingIndicators[rideId];
    },
    setChatLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setChatError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetChatState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setChatMessages,
  addChatMessage,
  updateChatMessageStatus,
  setRideUnreadCount,
  incrementRideUnreadCount,
  clearRideUnreadCount,
  setTotalUnreadCount,
  setUserTyping,
  clearTypingIndicators,
  setChatLoading,
  setChatError,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
