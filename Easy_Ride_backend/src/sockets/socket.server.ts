import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socket.middleware';
import { ConnectionHandler } from './handlers/connection.handler';
import { TrackingHandler } from './handlers/tracking.handler';
import { AuthenticatedSocket, LocationPayload } from './socket.types';
import { SocketEvents } from './socket.constants';

// Modular Socket Handlers
import { ChatSocket } from '../modules/chat/sockets/chat.socket';
import { CallSocket } from '../modules/call/sockets/call.socket';
import { registerRideHandlers } from '../modules/ride/sockets/ride.socket';
import { registerRiderHandlers } from '../modules/rider/sockets/rider.socket';
import { registerUserHandlers } from '../modules/user/sockets/user.socket';

export class SocketServer {
  constructor(private io: Server) {
    this.initialize();
  }

  private initialize() {
    // 1. Apply Middleware
    this.io.use(socketAuthMiddleware);

    // 2. Main Connection Handler
    this.io.on(SocketEvents.CONNECTION, (socket: AuthenticatedSocket) => {
      this.setupHandlers(socket);
    });
  }

  private async setupHandlers(socket: AuthenticatedSocket) {
    const connectionHandler = new ConnectionHandler(this.io, socket);
    const trackingHandler = new TrackingHandler(this.io, socket);
    
    // Initialize Class-based Modular Sockets
    const chatSocket = new ChatSocket(this.io, socket);
    const callSocket = new CallSocket(this.io, socket);

    // 1. Handle Initial Connection (Join rooms, Redis session)
    await connectionHandler.handleConnection();

    // 2. Register Functional Modular Sockets
    registerRideHandlers(this.io, socket);
    registerRiderHandlers(this.io, socket);
    registerUserHandlers(this.io, socket);

    // 3. Register Event Listeners
    
    // Tracking Events
    socket.on(SocketEvents.RIDER_LOCATION_UPDATE, (payload: LocationPayload) => 
      trackingHandler.handleRiderLocation(payload)
    );
    
    // Chat Events
    socket.on(SocketEvents.CHAT_TYPING, (payload: any) => chatSocket.handleTyping(payload));
    socket.on(SocketEvents.CHAT_READ, (payload: any) => chatSocket.handleReadReceipt(payload));

    // Call Events
    socket.on(SocketEvents.CALL_RINGING, (payload: any) => callSocket.handleRinging(payload));

    // Standard Events
    socket.on(SocketEvents.DISCONNECT, (reason) => 
      connectionHandler.handleDisconnect(reason)
    );

    socket.on(SocketEvents.ERROR, (error) => {
      console.error(`Socket Error [${socket.data.userId}]:`, error);
    });
  }
}

