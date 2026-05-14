import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socket.middleware';
import { ConnectionHandler } from './handlers/connection.handler';
import { TrackingHandler } from './handlers/tracking.handler';
import { AuthenticatedSocket, LocationPayload } from './socket.types';
import { SocketEvents } from './socket.constants';

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

    // 1. Handle Initial Connection (Join rooms, Redis session)
    await connectionHandler.handleConnection();

    // 2. Register Event Handlers
    
    // Tracking Events
    socket.on(SocketEvents.RIDER_LOCATION_UPDATE, (payload: LocationPayload) => 
      trackingHandler.handleRiderLocation(payload)
    );

    // Standard Events
    socket.on(SocketEvents.DISCONNECT, (reason) => 
      connectionHandler.handleDisconnect(reason)
    );

    socket.on(SocketEvents.ERROR, (error) => {
      console.error(`Socket Error [${socket.data.userId}]:`, error);
    });
  }
}
