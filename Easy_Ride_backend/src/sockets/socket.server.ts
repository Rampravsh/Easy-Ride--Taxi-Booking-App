import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socket.middleware';
import { ConnectionHandler } from './handlers/connection.handler';
import { TrackingHandler } from './handlers/tracking.handler';
import { AuthenticatedSocket, LocationPayload } from './socket.types';
import { SocketEvents } from './socket.constants';
import { ChatHandler } from '../modules/chat/sockets/chat.handler';
import { CallHandler } from '../modules/call/sockets/call.handler';


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
    const chatHandler = new ChatHandler(this.io, socket);
    const callHandler = new CallHandler(this.io, socket);


    // 1. Handle Initial Connection (Join rooms, Redis session)
    await connectionHandler.handleConnection();

    // 2. Register Event Handlers
    
    // Tracking Events
    socket.on(SocketEvents.RIDER_LOCATION_UPDATE, (payload: LocationPayload) => 
      trackingHandler.handleRiderLocation(payload)
    );
    
    // Chat Events
    socket.on(SocketEvents.CHAT_TYPING, (payload: any) => chatHandler.handleTyping(payload));
    socket.on(SocketEvents.CHAT_READ, (payload: any) => chatHandler.handleReadReceipt(payload));

    // Call Events
    socket.on(SocketEvents.CALL_RINGING, (payload: any) => callHandler.handleRinging(payload));


    // Standard Events
    socket.on(SocketEvents.DISCONNECT, (reason) => 
      connectionHandler.handleDisconnect(reason)
    );

    socket.on(SocketEvents.ERROR, (error) => {
      console.error(`Socket Error [${socket.data.userId}]:`, error);
    });
  }
}
