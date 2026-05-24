import { store } from '../redux/store';
import { notificationApi } from '../api/notification.api';
import { UserService } from './user.service';
import socketService from './socket.service';
import { 
  setNotifications, 
  addNotificationLocal,
  setUnreadCount, 
  setNotificationLoading, 
  setNotificationError,
  markReadLocal,
  markAllReadLocal
} from '../redux/slices/notificationSlice';
import { Notification } from '../types/notification';


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
        notificationApi.endpoints.getUnreadNotificationCount.initiate(undefined, { forceRefetch: true })
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
  },

  /**
   * Register Socket.IO listeners to receive push/in-app notifications in realtime.
   */
  initialize() {
    console.log('📡 [NotificationService] Initializing socket handlers...');

    // 1. Listen for new incoming general notifications
    socketService.on('notification:received', (payload: any) => {
      console.log('📡 [NotificationService] notification:received event:', payload);
      this.handleIncomingNotification(payload);
    });

    socketService.on('notification:new', (payload: any) => {
      console.log('📡 [NotificationService] notification:new event:', payload);
      this.handleIncomingNotification(payload);
    });

    // 2. Listen for ride status updates
    socketService.on('notification:ride_update', (payload: any) => {
      console.log('📡 [NotificationService] notification:ride_update event:', payload);
      this.handleIncomingNotification(payload);
    });
  },

  handleIncomingNotification(payload: any) {
    const formattedNotification: Notification = {
      _id: payload.notificationId || payload._id || 'notif_' + Date.now(),
      recipient: store.getState().auth.backendUser?._id || '',
      recipientType: 'user',
      title: payload.title || 'Easy Ride Update',
      body: payload.body || payload.content || '',
      notificationType: payload.notificationType || 'ride_update',
      deliveryType: ['in_app'],
      status: 'delivered',
      isRead: false,
      metadata: payload.data || payload.metadata || {},
      sentAt: new Date().toISOString(),
      readAt: null,
      retryCount: 0,
      createdAt: payload.timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Inject into getNotifications RTK cache
    store.dispatch(
      notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
        if (draft?.data) {
          const exists = draft.data.some((n) => n._id === formattedNotification._id);
          if (!exists) {
            draft.data.unshift(formattedNotification);
          }
        } else {
          draft.data = [formattedNotification];
        }
      })
    );

    // 2. Increment getUnreadNotificationCount RTK cache count
    store.dispatch(
      notificationApi.util.updateQueryData('getUnreadNotificationCount', undefined, (draft) => {
        if (draft?.data) {
          draft.data.count = (draft.data.count || 0) + 1;
        } else {
          draft.data = { count: 1 };
        }
      })
    );

    // 3. Keep standard slice in sync as fallback
    store.dispatch(addNotificationLocal(formattedNotification));
  },

  /**
   * Cleanup listeners
   */
  destroy() {
    socketService.off('notification:received');
    socketService.off('notification:new');
    socketService.off('notification:ride_update');
  }
};

