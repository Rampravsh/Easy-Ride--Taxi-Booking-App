import { Platform } from 'react-native';
import { store } from '../redux/store';
import { userApi } from '../api/user.api';
import { setUserProfile, setLoading, setError } from '../redux/slices/userSlice';

/**
 * Passenger User Service.
 * Implements high-level business helpers for profile hydrations, image uploads, and FCM registration.
 */
export const UserService = {
  /**
   * Refetches database profile and hydrates the global Redux state.
   */
  async hydrateUserProfile(): Promise<void> {
    store.dispatch(setLoading(true));
    try {
      // Initiate lazy refetch
      const result = await store.dispatch(
        userApi.endpoints.getUserProfile.initiate(undefined, { forceRefetch: true })
      ).unwrap();
      
      if (result.success && result.data) {
        store.dispatch(setUserProfile(result.data));
      } else {
        throw new Error(result.message || 'Hydration failed');
      }
    } catch (error: any) {
      console.error('[UserService] Hydration error:', error);
      store.dispatch(setError(error.message || 'Failed to hydrate user profile'));
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Formulates multipart/form-data upload payloads and triggers profile picture sync.
   */
  async uploadAvatar(imageUri: string): Promise<void> {
    store.dispatch(setLoading(true));
    try {
      const formData = new FormData();
      
      // Determine file extension
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `profile-avatar.${fileType}`;

      formData.append('image', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: fileName,
        type: `image/${fileType === 'png' ? 'png' : 'jpeg'}`,
      } as any);

      const result = await store.dispatch(
        userApi.endpoints.uploadProfileImage.initiate(formData)
      ).unwrap();

      if (result.success && result.data) {
        store.dispatch(setUserProfile(result.data));
      } else {
        throw new Error(result.message || 'Image upload failed');
      }
    } catch (error: any) {
      console.error('[UserService] Upload avatar failure:', error);
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * Registers securely the Firebase Cloud Messaging device push token with the backend.
   */
  async syncDeviceToken(fcmToken: string): Promise<void> {
    try {
      const result = await store.dispatch(
        userApi.endpoints.updateDeviceToken.initiate({ token: fcmToken })
      ).unwrap();

      if (result.success && result.data) {
        // Hydrate local cache with updated profile (which binds device token list)
        store.dispatch(setUserProfile(result.data));
        console.log('[UserService] Device FCM Push Token synced successfully');
      }
    } catch (error) {
      console.error('[UserService] Device token sync failed:', error);
    }
  }
};
