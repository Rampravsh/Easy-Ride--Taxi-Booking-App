import { RedisHelper } from '../shared/utils/redis.helper';
import { REDIS_KEYS, REDIS_TTL } from '../shared/constants/redis.constants';

export class SocketRedisService {
  /**
   * Save socket ID mapping for a user
   */
  static async saveUserSocket(userId: string, socketId: string): Promise<void> {
    const key = REDIS_KEYS.SOCKET_USER(userId);
    await RedisHelper.set(key, socketId, REDIS_TTL.SOCKET_SESSION);
  }

  /**
   * Get socket ID for a user
   */
  static async getUserSocket(userId: string): Promise<string | null> {
    const key = REDIS_KEYS.SOCKET_USER(userId);
    return await RedisHelper.get<string>(key);
  }

  /**
   * Save socket ID mapping for a rider
   */
  static async saveRiderSocket(riderId: string, socketId: string): Promise<void> {
    const key = REDIS_KEYS.SOCKET_RIDER(riderId);
    await RedisHelper.set(key, socketId, REDIS_TTL.SOCKET_SESSION);
  }

  /**
   * Get socket ID for a rider
   */
  static async getRiderSocket(riderId: string): Promise<string | null> {
    const key = REDIS_KEYS.SOCKET_RIDER(riderId);
    return await RedisHelper.get<string>(key);
  }

  /**
   * Remove socket mapping (on disconnect)
   */
  static async removeUserSocket(userId: string): Promise<void> {
    await RedisHelper.delete(REDIS_KEYS.SOCKET_USER(userId));
  }

  static async removeRiderSocket(riderId: string): Promise<void> {
    await RedisHelper.delete(REDIS_KEYS.SOCKET_RIDER(riderId));
  }
}
