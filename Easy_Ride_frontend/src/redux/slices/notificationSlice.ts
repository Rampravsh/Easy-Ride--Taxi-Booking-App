import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    addNotificationLocal(state, action: PayloadAction<Notification>) {
      // Avoid duplicate keys
      const exists = state.notifications.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    decrementUnreadCount(state) {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    markReadLocal(state, action: PayloadAction<string>) {
      const target = state.notifications.find((n) => n._id === action.payload);
      if (target && !target.isRead) {
        target.isRead = true;
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      }
    },
    markAllReadLocal(state) {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    setNotificationLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setNotificationError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotificationLocal,
  setUnreadCount,
  decrementUnreadCount,
  markReadLocal,
  markAllReadLocal,
  setNotificationLoading,
  setNotificationError,
} = notificationSlice.actions;
export default notificationSlice.reducer;
