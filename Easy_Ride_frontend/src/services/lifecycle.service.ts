import { AppState, AppStateStatus } from 'react-native';
import { store } from '../redux/store';
import { setAppState } from '../redux/slices/appSlice';
import socketService from './socket.service';
import networkService from './network.service';
import analyticsService from './analytics.service';
import retryQueueService from './retryQueue.service';
import { rideApi } from '../api/ride.api';

class LifecycleService {
  private subscription: { remove: () => void } | null = null;
  private currentAppState: AppStateStatus = 'active';

  /**
   * Initializes the global application state lifecycle listeners.
   */
  public initialize() {
    console.log('🔄 [LifecycleService] Registering application state event listeners...');
    
    this.subscription = AppState.addEventListener('change', (nextAppState) => {
      this.handleAppStateChange(nextAppState);
    });
  }

  /**
   * Triggers actions depending on whether the app was foregrounded or backgrounded.
   */
  private handleAppStateChange(nextAppState: AppStateStatus) {
    console.log(`🔄 [LifecycleService] Application AppState transition: ${this.currentAppState} -> ${nextAppState}`);
    
    const isForeground = nextAppState === 'active';
    store.dispatch(setAppState(isForeground));

    if (this.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
      this.handleForegroundRecovery();
    } else if (nextAppState === 'background') {
      this.handleBackgroundSuspension();
    }

    this.currentAppState = nextAppState;
  }

  /**
   * Re-establishes connections and syncs active states on foreground transition.
   */
  private async handleForegroundRecovery() {
    console.log('🔄 [LifecycleService] App foregrounded. Triggering active recovery checks...');
    analyticsService.trackEvent('app_foregrounded');

    const state = store.getState();
    const isAuth = state.auth.authenticated;
    const isOnline = state.network.isOnline;

    if (isOnline) {
      // 1. Flush offline request queues
      retryQueueService.flushQueue().catch((err) => {
        console.error('[LifecycleService] Error flushing queue on foreground recovery:', err);
      });

      // 2. Re-establish active Socket.IO connection
      if (isAuth) {
        console.log('🔄 [LifecycleService] Rejoining websocket rooms and active ride sync');
        socketService.connect();

        // 3. Re-trigger active ride check from backend to synchronize layout state
        const activeRideId = state.ride.activeRide?._id;
        if (activeRideId) {
          store.dispatch(
            rideApi.endpoints.getRideDetails.initiate(activeRideId, { subscribe: false, forceRefetch: true })
          );
        }
      }
    }
  }

  /**
   * Tears down non-essential resources to preserve battery life and memory in background.
   */
  private handleBackgroundSuspension() {
    console.log('🔄 [LifecycleService] App backgrounded. Suspending socket listener loops');
    analyticsService.trackEvent('app_backgrounded');

    // Suspend non-critical background socket routines to be compliant with Apple APNS/Android limits
    // Sockets will naturally time out or be disconnected in background on mobile; we manually disconnect 
    // to preserve memory if no active ride or Twilio calling handshake is running
    const state = store.getState();
    const hasActiveCall = state.call.status !== 'idle';
    const hasActiveRide = !!state.ride.activeRide;

    if (!hasActiveCall && !hasActiveRide) {
      console.log('🔄 [LifecycleService] Disconnecting socket temporarily to save battery...');
      socketService.disconnect();
    }
  }

  /**
   * Cleans up AppState event listener subscriptions.
   */
  public destroy() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
      console.log('🔄 [LifecycleService] Cleared app state listeners');
    }
  }
}

export const lifecycleService = new LifecycleService();
export default lifecycleService;
