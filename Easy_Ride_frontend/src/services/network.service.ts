import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { store } from '../redux/store';
import { setConnectionStatus } from '../redux/slices/networkSlice';
import { showToast } from '../redux/slices/appSlice';
import retryQueueService from './retryQueue.service';
import socketService from './socket.service';

class NetworkService {
  private unsubscribe: (() => void) | null = null;

  /**
   * Initializes network status listener and loads cached offline actions queue.
   */
  public initialize() {
    console.log('📡 [NetworkService] Registering connectivity listeners...');
    
    // 1. Initialize persistent storage queues
    retryQueueService.initialize().catch((err) => {
      console.error('[NetworkService] Failed to initialize retry queue:', err);
    });

    // 2. Register NetInfo subscription listener
    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      this.handleNetworkChange(state);
    });
  }

  /**
   * Handles state changes reported by the NetInfo API.
   */
  private handleNetworkChange(state: NetInfoState) {
    const isOnline = !!state.isConnected && !!state.isInternetReachable;
    const connectionType = state.type;
    const previousOnline = store.getState().network.isOnline;

    console.log(`📡 [NetworkService] Connectivity Update: online=${isOnline}, type=${connectionType}`);

    // Update global state in Redux
    store.dispatch(
      setConnectionStatus({
        isOnline,
        connectionType,
      })
    );

    if (isOnline && !previousOnline) {
      console.log('📡 [NetworkService] Connection restored! Flushing offline actions & rejoining socket rooms');
      
      // Notify user of connection recovery
      store.dispatch(
        showToast({
          message: 'Connection restored. Syncing details...',
          type: 'success',
          duration: 3000,
        })
      );

      // Reconnect/re-verify active socket connection
      const authenticated = store.getState().auth.authenticated;
      if (authenticated) {
        // Attempt to establish real-time websocket connection immediately
        socketService.connect();
      }

      // Flush and replay deferred API actions
      retryQueueService.flushQueue().catch((err) => {
        console.error('[NetworkService] Error flushing queue:', err);
      });

    } else if (!isOnline && previousOnline) {
      console.log('📡 [NetworkService] Network connection dropped!');
      
      // Warn user of offline status
      store.dispatch(
        showToast({
          message: 'Offline mode active. Failed requests will auto-retry upon reconnection.',
          type: 'error',
          duration: 4000,
        })
      );
    }
  }

  /**
   * Cleans up subscription listeners.
   */
  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      console.log('📡 [NetworkService] Unregistered connectivity listeners');
    }
  }
}

export const networkService = new NetworkService();
export default networkService;
