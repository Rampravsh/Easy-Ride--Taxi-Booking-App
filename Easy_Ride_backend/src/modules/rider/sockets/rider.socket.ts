import { Server, Socket } from 'socket.io';
import logger from '../../../shared/utils/logger';

export const registerRiderHandlers = (io: Server, socket: Socket) => {
  socket.on('rider:online', () => {
    // Logic for rider going online
  });

  socket.on('rider:location_update', (data: any) => {
    // Logic for rider location updates
  });
};
