import { InteractionManager } from 'react-native';

/**
 * Mobile-first performance monitoring and rendering optimizations.
 */
export const performanceUtil = {
  /**
   * Safe execution wrapper that defers non-visual or intensive computations
   * until active navigation transitions and animations have fully completed.
   */
  runAfterInteractions: <T>(task: () => T | Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      InteractionManager.runAfterInteractions(() => {
        try {
          resolve(task());
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  /**
   * Lightweight latency instrumentation helper to calculate frame time differences.
   */
  measureDuration: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const start = Date.now();
    try {
      const result = await fn();
      const elapsed = Date.now() - start;
      console.log(`⚡ [Performance] ${label} resolved in ${elapsed}ms`);
      return result;
    } catch (error) {
      const elapsed = Date.now() - start;
      console.warn(`⚡ [Performance] ${label} failed after ${elapsed}ms`);
      throw error;
    }
  },

  /**
   * Helper to format bytes cleanly for debugging logs.
   */
  formatBytes: (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
};
export default performanceUtil;
