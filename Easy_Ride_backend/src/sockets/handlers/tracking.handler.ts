import { Server } from 'socket.io';
import { AuthenticatedSocket, LocationPayload } from '../socket.types';
import { validateLocation } from '../validators/location.validator';
import { RedisHelper } from '../../shared/utils/redis.helper';
import { REDIS_KEYS } from '../../shared/constants/redis.constants';
import { UserRole } from '../../shared/enums';
import { SOCKET_ROOMS, SocketEvents } from '../socket.constants';

export class TrackingHandler {
  constructor(private io: Server, private socket: AuthenticatedSocket) {}

  /**
   * Handle Rider Location Updates
   */
  async handleRiderLocation(payload: LocationPayload) {
    const { userId, role } = this.socket.data;

    // 1. Validate Payload
    const validation = validateLocation(payload);
    if (!validation.success) return;

    // 2. Only Riders can update their location
    if (role !== UserRole.RIDER) return;

    const { latitude, longitude } = payload;

    // 3. Update Redis (Active Riders GEO Set)
    await RedisHelper.geoAdd(REDIS_KEYS.ACTIVE_RIDERS, longitude, latitude, userId);
    
    // 4. Update individual rider location cache
    await RedisHelper.set(REDIS_KEYS.RIDER_LOCATION(userId), payload);

    // 5. Broadcast to everyone tracking this rider (e.g., in a specific ride room)
    // Riders are always in their own room, so we emit to that room and any ride room
    this.socket.to(SOCKET_ROOMS.RIDER(userId)).emit(SocketEvents.RIDER_LOCATION_UPDATE, {
      riderId: userId,
      ...payload,
    });

    // 6. Pub/Sub for cross-server scaling
    await RedisHelper.publish(REDIS_KEYS.CHANNEL_LOCATION_UPDATES, {
      riderId: userId,
      ...payload,
    });
  }
}
