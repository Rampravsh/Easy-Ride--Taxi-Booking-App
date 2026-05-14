import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket.types';
import { SocketRedisService } from '../socket.redis';
import { SOCKET_ROOMS } from '../socket.constants';
import { UserRole } from '../../shared/enums';

export class ConnectionHandler {
  constructor(private io: Server, private socket: AuthenticatedSocket) {}

  /**
   * Initialize Connection
   */
  async handleConnection() {
    const { userId, role } = this.socket.data;

    console.log(`📡 Socket Connected: ${userId} (${role})`);

    // 1. Map Socket to User/Rider in Redis
    if (role === UserRole.RIDER) {
      await SocketRedisService.saveRiderSocket(userId, this.socket.id);
      // Join Rider-specific room
      this.socket.join(SOCKET_ROOMS.RIDER(userId));
    } else {
      await SocketRedisService.saveUserSocket(userId, this.socket.id);
      // Join User-specific room
      this.socket.join(SOCKET_ROOMS.USER(userId));
    }

    // 2. Global Role Room (useful for mass broadcasts)
    this.socket.join(`role:${role}`);
  }

  /**
   * Handle Disconnection
   */
  async handleDisconnect(reason: string) {
    const { userId, role } = this.socket.data;
    console.log(`🔌 Socket Disconnected: ${userId} - Reason: ${reason}`);

    // Clean up Redis mappings
    if (role === UserRole.RIDER) {
      await SocketRedisService.removeRiderSocket(userId);
    } else {
      await SocketRedisService.removeUserSocket(userId);
    }
  }
}
