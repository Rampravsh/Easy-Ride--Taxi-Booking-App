import { store } from '../redux/store';
import { notificationApi } from '../api/notification.api';
import { UserService } from './user.service';
import { 
  setNotifications, 
  setUnreadCount, 
  setNotificationLoading, 
  setNotificationError,
  markReadLocal,
  markAllReadLocal
} from '../redux/slices/notificationSlice';

/**
 * Notifications Management Service.
 * Implements high-level coordinates linking API query triggers with Redux cache storage.
 */
export const NotificationService = {
  /**
   * Refetches latest notifications list and updates the global cache.
   */
  async fetchNotifications(page = 1, limit = 20): Promise<void> {
    store.dispatch(setNotificationLoading(true));
    try {
      const result = await store.dispatch(
        notificationApi.endpoints.getNotifications.initiate({ page, limit }, { forceRefetch: true })
      ).unwrap();

      if (result.success && result.data) {
        store.dispatch(setNotifications(result.data));
      }
    } catch (error: any) {
      console.error('[NotificationService] Fetch notifications failed:', error);
      store.dispatch(setNotificationError(error.message || 'Failed to retrieve notifications'));
    } finally {
      store.dispatch(setNotificationLoading(false));
    }
  },

  /**
   * Fetches unread notification count to maintain badge indicators.
   */
  async syncUnreadCount(): Promise<number> {
    try {
      const result = await store.dispatch(
        notificationApi.endpoints.getUnreadCount.initiate(undefined, { forceRefetch: true })
      ).unwrap();

      if (result.success && result.data) {
        store.dispatch(setUnreadCount(result.data.count));
        return result.data.count;
      }
      return 0;
    } catch (error) {
      console.error('[NotificationService] Sync unread count failed:', error);
      return 0;
    }
  },

  /**
   * Mark a specific notification message as read.
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // Optimistic updates are already registered on the API mutation itself
      await store.dispatch(
        notificationApi.endpoints.markNotificationRead.initiate(notificationId)
      ).unwrap();
      
      // Update state locally for safety
      store.dispatch(markReadLocal(notificationId));
    } catch (error) {
      console.error(`[NotificationService] Mark read failed for ID "${notificationId}":`, error);
    }
  },

  /**
   * Mark all unread notification messages as read.
   */
  async markAllAsRead(): Promise<void> {
    try {
      // Optimistic updates are already registered on the API mutation itself
      await store.dispatch(
        notificationApi.endpoints.markAllNotificationsRead.initiate()
      ).unwrap();

      // Update state locally for safety
      store.dispatch(markAllReadLocal());
    } catch (error) {
      console.error('[NotificationService] Mark all read failed:', error);
    }
  },

  /**
   * Boilerplate infrastructure to query push token permission, retrieve the device registration token,
   * and call the UserService to sync it with the passenger's MongoDB profile via PUT /users/device-token.
   */
  async registerDeviceToken(): Promise<void> {
    try {
      console.log('[NotificationService] Requesting notification permissions...');
      
      // Simulated retrieval of FCM push token for infrastructure preparation
      const simulatedToken = 'fcm_token_passenger_' + Math.random().toString(36).substring(2, 15);
      
      console.log('[NotificationService] Retrieved FCM Token:', simulatedToken);
      
      // Synchronize with database via PUT /users/device-token
      await UserService.syncDeviceToken(simulatedToken);
    } catch (error) {
      console.error('[NotificationService] Token registration infrastructure error:', error);
    }
  }
};

