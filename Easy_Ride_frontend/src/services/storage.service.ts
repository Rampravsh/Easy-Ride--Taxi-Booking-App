import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Enterprise Storage Service wrapper around AsyncStorage.
 * Incorporates safe serialization/deserialization and uniform error tracking.
 */
export const StorageService = {
  /**
   * Safely retrieve and parse typed value from AsyncStorage.
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;
      try {
        return JSON.parse(data) as T;
      } catch {
        // Fallback: If value is not a valid JSON string (e.g. raw JWT token string), return it directly
        return data as unknown as T;
      }
    } catch (error) {
      console.error(`[StorageService] Error reading key "${key}":`, error);
      return null;
    }
  },

  /**
   * Safely serialize and store value in AsyncStorage.
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, data);
    } catch (error) {
      console.error(`[StorageService] Error writing key "${key}":`, error);
    }
  },

  /**
   * Remove a specific key from AsyncStorage.
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Error deleting key "${key}":`, error);
    }
  },

  /**
   * Clear all Easy Ride related storage records.
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[StorageService] Error clearing storage:', error);
    }
  }
};
