import { Server, Socket } from 'socket.io';
import logger from '../../../shared/utils/logger';

export const registerUserHandlers = (io: Server, socket: Socket) => {
  socket.on('user:presence', (status: string) => {
    // Logic for user presence
  });
};
