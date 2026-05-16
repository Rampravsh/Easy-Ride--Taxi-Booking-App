import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socket.middleware';
import { ConnectionHandler } from './handlers/connection.handler';
import { TrackingHandler } from './handlers/tracking.handler';
import { AuthenticatedSocket, LocationPayload, ChatMessagePayload, TypingPayload, CallPayload } from './socket.types';
import { SocketEvents } from './socket.constants';
import logger from '../shared/utils/logger';

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
    // 1. Apply Authentication Middleware
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
    socket.on(SocketEvents.CHAT_TYPING, (payload: TypingPayload) =>
      chatSocket.handleTyping(payload)
    );
    socket.on(SocketEvents.CHAT_READ, (payload: { rideId: string; messageId: string }) =>
      chatSocket.handleReadReceipt(payload)
    );

    // Call Events
    socket.on(SocketEvents.CALL_RINGING, (payload: CallPayload) =>
      callSocket.handleRinging(payload)
    );

    // Pool Events
    // TODO: registerPoolHandlers(this.io, socket) — wire when PoolSocket is implemented

    // Schedule Events
    // TODO: registerScheduleHandlers(this.io, socket) — wire when ScheduleSocket is implemented

    // Admin Events
    // TODO: registerAdminHandlers(this.io, socket) — for admin broadcast channel

    // Standard Events
    socket.on(SocketEvents.DISCONNECT, (reason: string) =>
      connectionHandler.handleDisconnect(reason)
    );

    socket.on(SocketEvents.ERROR, (error: Error) => {
      // Use logger — not console.error — for consistent log format and correlation ID support
      logger.error(`Socket error`, {
        userId: socket.data.userId,
        role: socket.data.role,
        error: error.message,
      });
    });
  }
}
