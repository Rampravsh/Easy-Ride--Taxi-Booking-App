import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../shared/utils/logger';

let io: Server;

/**
 * Initialize Socket.io server
 * @param server HTTP server instance
 * @returns Initialized Socket.io server
 */
export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Basic connection handler
  io.on('connection', (socket: Socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Standard disconnect handler
    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected: ${socket.id} (${reason})`);
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error(`Socket error for client ${socket.id}:`, error);
    });
  });

  logger.info('Socket.io initialized successfully');
  return io;
};

/**
 * Get the initialized Socket.io instance
 * @returns Socket.io Server instance
 */
export const getIO = (): Server => {
  if (!io) {
    logger.error('Socket.io has not been initialized. Please call initSocket first.');
    throw new Error('Socket.io not initialized');
  }
  return io;
};
