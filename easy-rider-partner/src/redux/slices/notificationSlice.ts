import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  unreadCount: number;
  notifications: any[];
}

const initialState: NotificationState = {
  unreadCount: 0,
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
