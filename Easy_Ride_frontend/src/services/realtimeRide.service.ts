import socketService from './socket.service';
import { store } from '../redux/store';
import { 
  setActiveRide, 
  setRideStatus 
} from '../redux/slices/rideSlice';
import { 
  setCurrentRideRoom, 
  setRiderLiveLocation, 
  setRealtimeRideStatus,
  resetSocketState
} from '../redux/slices/socketSlice';
import { 
  SocketEvents, 
  RiderLocationUpdate, 
  RideLocationSyncEvent, 
  RideCancelledEvent 
} from '../types/socket';
import { RideStatus, Ride } from '../types/ride';

class RealtimeRideService {
  private activeListeners = new Set<string>();

  /**
   * Initialize socket connection and global listeners.
   * Auto-rejoins the active ride room if connection drops.
   */
  public initialize() {
    // 1. Establish connection
    socketService.connect().catch((err) => {
      console.error('[RealtimeRideService] Autoconnect failed on init:', err);
    });

    // 2. Setup reconnection handler to automatically rejoin active ride room
    socketService.on(SocketEvents.CONNECT, () => {
      const state = store.getState();
      const activeRideId = state.ride.activeRide?._id;
      if (activeRideId) {
        console.log(`🔄 [RealtimeRideService] Re-joining ride room: ${activeRideId} on socket reconnect`);
        this.joinRideRoom(activeRideId);
      }
    });
  }

  /**
   * Joins a specific ride room to receive realtime tracking events.
   */
  public joinRideRoom(rideId: string) {
    if (!rideId) return;
    
    console.log(`📡 [RealtimeRideService] Joining ride room: ${rideId}`);
    
    // Connect first if disconnected
    socketService.connect().then(() => {
      socketService.emit(SocketEvents.RIDE_JOIN, rideId);
      store.dispatch(setCurrentRideRoom(`ride:${rideId}`));
      this.setupRideRoomListeners(rideId);
    }).catch(err => {
      console.error(`[RealtimeRideService] Failed to join ride room ${rideId}:`, err);
    });
  }

  /**
   * Leaves the active ride room and cleans up listeners.
   */
  public leaveRideRoom(rideId: string) {
    if (!rideId) return;

    console.log(`🔌 [RealtimeRideService] Leaving ride room: ${rideId}`);
    socketService.emit(SocketEvents.RIDE_LEAVE, rideId);
    
    store.dispatch(setCurrentRideRoom(null));
    store.dispatch(resetSocketState());
    
    this.cleanupListeners();
  }

  /**
   * Configures event listeners for the specific ride.
   */
  private setupRideRoomListeners(rideId: string) {
    // Clear any previous listeners first to avoid duplication
    this.cleanupListeners();

    // 1. Listen for Ride Accepted
    this.registerListener(SocketEvents.RIDE_ACCEPTED, (ride: Ride) => {
      console.log('📡 [RealtimeRideService] Ride Accepted event received:', ride._id);
      store.dispatch(setActiveRide(ride));
      store.dispatch(setRealtimeRideStatus(ride.status));
    });

    // 2. Listen for Ride Arrived
    this.registerListener(SocketEvents.RIDE_ARRIVED, (ride: Ride) => {
      console.log('📡 [RealtimeRideService] Ride Arrived event received');
      store.dispatch(setActiveRide(ride));
      store.dispatch(setRealtimeRideStatus('arrived'));
    });

    // 3. Listen for Ride Started
    this.registerListener(SocketEvents.RIDE_STARTED, (ride: Ride) => {
      console.log('📡 [RealtimeRideService] Ride Started event received');
      store.dispatch(setActiveRide(ride));
      store.dispatch(setRealtimeRideStatus('started'));
    });

    // 4. Listen for Ride Completed
    this.registerListener(SocketEvents.RIDE_COMPLETED, (ride: Ride) => {
      console.log('📡 [RealtimeRideService] Ride Completed event received');
      store.dispatch(setActiveRide(ride));
      store.dispatch(setRealtimeRideStatus('completed'));
      
      // Auto leave ride room upon completion
      this.leaveRideRoom(rideId);
    });

    // 5. Listen for Ride Cancelled
    this.registerListener(SocketEvents.RIDE_CANCELLED, (event: RideCancelledEvent) => {
      console.log('📡 [RealtimeRideService] Ride Cancelled event received:', event.reason);
      const state = store.getState();
      const currentRide = state.ride.activeRide;
      if (currentRide && currentRide._id === event.rideId) {
        const updatedRide: Ride = {
          ...currentRide,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancellationReason: event.reason,
        };
        store.dispatch(setActiveRide(updatedRide));
        store.dispatch(setRealtimeRideStatus('cancelled'));
      }
      
      // Auto leave ride room upon cancellation
      this.leaveRideRoom(rideId);
    });

    // 6. Listen for Ride Location Sync (Server -> User)
    // Primary path for updating live coordinates during active ride room
    this.registerListener(SocketEvents.RIDE_LOCATION_SYNC, (event: RideLocationSyncEvent) => {
      if (event.rideId !== rideId) return;

      const latitude = event.coordinates[1];
      const longitude = event.coordinates[0];

      // Update location state in Redux socketSlice
      const locationUpdate: RiderLocationUpdate = {
        riderId: '', // Sync room includes ride info, rider ID isn't critical for client rendering
        latitude,
        longitude,
        heading: event.heading,
        rideId: event.rideId,
      };
      
      store.dispatch(setRiderLiveLocation(locationUpdate));

      // Synchronize the ride status dynamically if sent inside sync packet
      if (event.status) {
        const currentStatus = event.status as RideStatus;
        store.dispatch(setRealtimeRideStatus(currentStatus));
        store.dispatch(setRideStatus(currentStatus));
      }
    });

    // 7. Listen for direct Rider Location Update (Rider -> Server -> Users)
    this.registerListener(SocketEvents.RIDER_LOCATION_UPDATE, (event: RiderLocationUpdate) => {
      if (event.rideId && event.rideId !== rideId) return;
      
      console.log('📡 [RealtimeRideService] Direct rider:location_update received:', event);
      store.dispatch(setRiderLiveLocation(event));
    });
  }

  /**
   * Helper to register socket listeners while maintaining clean tracking references for cleanup.
   */
  private registerListener(event: string, callback: (...args: any[]) => void) {
    socketService.on(event, callback);
    this.activeListeners.add(event);
  }

  /**
   * Cleans up all active socket listeners.
   */
  public cleanupListeners() {
    this.activeListeners.forEach((event) => {
      socketService.off(event);
    });
    this.activeListeners.clear();
  }
}

export const realtimeRideService = new RealtimeRideService();
export default realtimeRideService;
