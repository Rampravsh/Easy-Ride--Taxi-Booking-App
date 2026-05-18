import { io, Socket } from 'socket.io-client';
import { ENV } from '../constants/env';
import { FirebaseService } from './firebase.service';
import { store } from '../redux/store';
import { setConnectionState, setSocketLatency } from '../redux/slices/socketSlice';
import { SocketEvents } from '../types/socket';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private pingStartTime = 0;

  /**
   * Dynamically resolves the Socket.IO server URL based on the API base URL.
   */
  private getSocketUrl(): string {
    return ENV.API_BASE_URL.replace('/api/v1', '');
  }

  /**
   * Connect to the Socket.IO server with Firebase token authentication.
   */
  public async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      if (this.socket) return this.socket;
    }

    this.isConnecting = true;
    store.dispatch(setConnectionState('reconnecting'));

    try {
      // 1. Fetch Firebase ID Token
      const token = await FirebaseService.getIdToken(true); // Force refresh to guarantee fresh handshake
      if (!token) {
        throw new Error('Firebase ID Token is null. User might not be authenticated.');
      }

      const socketUrl = this.getSocketUrl();
      console.log(`📡 Initializing Socket.IO connection to: ${socketUrl}`);

      // 2. Initialize Socket.IO instance
      this.socket = io(socketUrl, {
        auth: {
          token,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      // 3. Register standard event listeners
      this.setupLifecycleListeners();

      return this.socket;
    } catch (error) {
      console.error('[SocketService] Connection establishment failed:', error);
      store.dispatch(setConnectionState('error'));
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Disconnect the socket client.
   */
  public disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting Socket.IO client manually');
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    store.dispatch(setConnectionState('disconnected'));
  }

  /**
   * Standard connection state and recovery handling.
   */
  private setupLifecycleListeners() {
    if (!this.socket) return;

    this.socket.on(SocketEvents.CONNECT, () => {
      console.log('📡 Socket.IO connected successfully, ID:', this.socket?.id);
      store.dispatch(setConnectionState('connected'));
      this.isConnecting = false;
    });

    this.socket.on(SocketEvents.DISCONNECT, (reason) => {
      console.warn('🔌 Socket.IO disconnected. Reason:', reason);
      store.dispatch(setConnectionState('disconnected'));
      
      // If server disconnected the socket, auth might have expired, refresh token & reconnect
      if (reason === 'io server disconnect') {
        this.reconnectWithFreshToken();
      }
    });

    this.socket.on(SocketEvents.CONNECT_ERROR, async (error: any) => {
      console.error('🔌 Socket.IO connection error:', error.message);
      store.dispatch(setConnectionState('error'));

      // If connection error is auth-related, attempt a token refresh and reconnection
      if (error.message && error.message.includes('Authentication error')) {
        console.log('🔑 Socket auth failed. Refreshing Firebase token and retrying...');
        this.reconnectWithFreshToken();
      }
    });

    this.socket.on(SocketEvents.RECONNECT_ATTEMPT, (attempt: number) => {
      console.log(`🔌 Socket.IO reconnection attempt #${attempt}`);
      store.dispatch(setConnectionState('reconnecting'));
    });

    // Latency tracking via Manager ping/pong
    (this.socket.io as any).on('ping', () => {
      this.pingStartTime = Date.now();
    });

    (this.socket.io as any).on('pong', () => {
      const latency = Date.now() - this.pingStartTime;
      store.dispatch(setSocketLatency(latency));
    });
  }

  /**
   * Reconnects the socket client by acquiring a fresh Firebase ID Token.
   */
  private async reconnectWithFreshToken() {
    this.disconnect();
    try {
      console.log('🔄 Reconnecting with fresh token...');
      await this.connect();
    } catch (err) {
      console.error('[SocketService] Token-refreshed reconnection failed:', err);
    }
  }

  /**
   * Retrieve active socket instance.
   */
  public getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Subscribe to a socket event.
   */
  public on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn(`[SocketService] Trying to listen to "${event}" before socket connection is active`);
      return;
    }
    this.socket.on(event, callback);
  }

  /**
   * Unsubscribe from a socket event.
   */
  public off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  /**
   * Emit an event to the server.
   */
  public emit(event: string, ...args: any[]) {
    if (!this.socket?.connected) {
      console.warn(`[SocketService] Emitting "${event}" failed: socket is not connected`);
      return false;
    }
    this.socket.emit(event, ...args);
    return true;
  }
}

export const socketService = new SocketService();
export default socketService;
