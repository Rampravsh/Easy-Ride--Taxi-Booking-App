import dotenv from 'dotenv';
import http from 'http';
import connectDB from './config/db';
import app from './app';
import logger from './config/logger';
import { initSocket } from './config/socket';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});
