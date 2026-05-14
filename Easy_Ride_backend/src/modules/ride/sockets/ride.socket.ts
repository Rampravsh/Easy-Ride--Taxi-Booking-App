import { Server, Socket } from 'socket.io';
import logger from '../../../shared/utils/logger';


export const registerRideHandlers = (io: Server, socket: Socket) => {
  socket.on('ride:join', (rideId: string) => {
    socket.join(`ride:${rideId}`);
    logger.info(`User ${socket.id} joined ride room: ${rideId}`);
  });

  socket.on('ride:leave', (rideId: string) => {
    socket.leave(`ride:${rideId}`);
    logger.info(`User ${socket.id} left ride room: ${rideId}`);
  });
};
