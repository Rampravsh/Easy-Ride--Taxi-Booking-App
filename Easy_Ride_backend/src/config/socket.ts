import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../shared/utils/logger';
import { SocketServer } from '../sockets/socket.server';

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

  // Initialize the Modular Socket Server
  new SocketServer(io);

  logger.info('🚀 Modular Socket.io server initialized');
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
