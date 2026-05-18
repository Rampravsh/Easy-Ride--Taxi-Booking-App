import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../redux/store';
import {
  addToRetryQueue,
  removeFromRetryQueue,
  incrementRetryCount,
  clearRetryQueue,
  QueuedRequest,
} from '../redux/slices/networkSlice';
import { apiClient } from '../api/axios';
import { retryWithBackoff } from '../utils/retry.util';

const STORAGE_RETRY_QUEUE_KEY = '@easy_ride_retry_queue';

class RetryQueueService {
  private isProcessing = false;

  /**
   * Initializes the retry queue by loading any persisted requests from storage
   * and syncing them to the Redux network slice.
   */
  public async initialize() {
    try {
      const persistedQueueStr = await AsyncStorage.getItem(STORAGE_RETRY_QUEUE_KEY);
      if (persistedQueueStr) {
        const persistedQueue: QueuedRequest[] = JSON.parse(persistedQueueStr);
        console.log(`🔄 [RetryQueueService] Loaded ${persistedQueue.length} requests from persistent storage`);
        
        // Push loaded items into the Redux store
        for (const req of persistedQueue) {
          store.dispatch(addToRetryQueue(req));
        }
      }
    } catch (error) {
      console.error('[RetryQueueService] Failed to load persisted queue:', error);
    }
  }

  /**
   * Saves the current Redux retry queue to persistent AsyncStorage.
   */
  private async persistQueue(queue: QueuedRequest[]) {
    try {
      await AsyncStorage.setItem(STORAGE_RETRY_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('[RetryQueueService] Failed to persist queue:', error);
    }
  }

  /**
   * Registers a failed API request to be queued and retried later.
   */
  public async registerFailedRequest(
    config: {
      url: string;
      method: QueuedRequest['method'];
      body?: any;
      headers?: Record<string, string>;
    },
    maxRetries = 5
  ) {
    const id = `${config.method}_${config.url}_${Date.now()}`;
    const newReq: Omit<QueuedRequest, 'retryCount' | 'timestamp'> = {
      id,
      url: config.url,
      method: config.method,
      body: config.body,
      headers: config.headers,
      maxRetries,
    };

    console.log(`🔄 [RetryQueueService] Queueing failed request: [${config.method}] ${config.url}`);
    
    // Add to Redux store
    store.dispatch(addToRetryQueue(newReq));

    // Save to storage
    const currentQueue = store.getState().network.retryQueue;
    await this.persistQueue(currentQueue);
  }

  /**
   * Iterates through the queued requests and attempts to execute them.
   * If a request succeeds, it is removed from the queue.
   * If it fails and has retries left, its count is incremented.
   */
  public async flushQueue() {
    if (this.isProcessing) return;
    
    const queue = store.getState().network.retryQueue;
    if (queue.length === 0) return;

    this.isProcessing = true;
    console.log(`🔄 [RetryQueueService] Flushing ${queue.length} queued requests...`);

    // Process requests in chronological order
    const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);

    for (const req of sortedQueue) {
      if (req.retryCount >= req.maxRetries) {
        console.warn(`🔄 [RetryQueueService] Max retries exceeded for ${req.url}. Removing.`);
        store.dispatch(removeFromRetryQueue(req.id));
        continue;
      }

      try {
        console.log(`🔄 [RetryQueueService] Retrying request [${req.method}] ${req.url} (Attempt ${req.retryCount + 1}/${req.maxRetries})`);

        // Execute request utilizing retry backoff wrapper
        await retryWithBackoff(
          () =>
            apiClient({
              url: req.url,
              method: req.method,
              data: req.body,
              headers: req.headers,
            }),
          {
            maxRetries: 2,
            initialDelayMs: 500,
            shouldRetry: (err) => {
              // Only retry on network errors or 5xx server issues (not 4xx user failures)
              const status = err.response?.status;
              return !status || status >= 500;
            },
          }
        );

        console.log(`✅ [RetryQueueService] Queued request succeeded: ${req.url}`);
        store.dispatch(removeFromRetryQueue(req.id));
      } catch (error) {
        console.error(`❌ [RetryQueueService] Failed execution of queued request ${req.url}:`, error);
        store.dispatch(incrementRetryCount(req.id));
      }
    }

    // Sync remaining elements back to local persistent storage
    const remainingQueue = store.getState().network.retryQueue;
    await this.persistQueue(remainingQueue);
    
    this.isProcessing = false;
  }

  /**
   * Resets the entire retry queue.
   */
  public async clearAll() {
    store.dispatch(clearRetryQueue());
    await AsyncStorage.removeItem(STORAGE_RETRY_QUEUE_KEY);
    console.log('🔄 [RetryQueueService] Retry queue cleared');
  }
}

export const retryQueueService = new RetryQueueService();
export default retryQueueService;
