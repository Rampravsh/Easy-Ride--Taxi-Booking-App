import { io, Socket } from 'socket.io-client';
import { store } from '../redux/store';
import { setConnected } from '../redux/slices/socketSlice';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io('YOUR_BACKEND_URL', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      store.dispatch(setConnected(true));
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      store.dispatch(setConnected(false));
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Ride Request Listener
    this.socket.on('newRideRequest', (data) => {
      // Handle new ride request (e.g., show modal, play sound)
      console.log('New ride request:', data);
    });

    // Chat Message Listener
    this.socket.on('message', (data) => {
      console.log('New message:', data);
    });
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new SocketService();
