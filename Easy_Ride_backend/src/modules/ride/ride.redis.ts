import { RedisHelper } from '../../shared/utils/redis.helper';
import { REDIS_KEYS, REDIS_TTL } from '../../shared/constants/redis.constants';

export class RideRedisService {
  /**
   * Cache active ride details for fast lookup
   */
  static async cacheActiveRide(rideId: string, rideData: any): Promise<void> {
    const key = REDIS_KEYS.ACTIVE_RIDE(rideId);
    await RedisHelper.set(key, rideData, REDIS_TTL.ACTIVE_RIDE);
  }

  /**
   * Get cached active ride
   */
  static async getCachedRide(rideId: string): Promise<any | null> {
    const key = REDIS_KEYS.ACTIVE_RIDE(rideId);
    return await RedisHelper.get(key);
  }

  /**
   * Update ride location in Redis (Realtime tracking)
   */
  static async updateRideLocation(rideId: string, lat: number, lng: number): Promise<void> {
    const key = REDIS_KEYS.RIDE_TRACKING(rideId);
    const locationData = { lat, lng, timestamp: new Date().toISOString() };
    await RedisHelper.set(key, locationData, REDIS_TTL.RIDER_LOCATION);
  }

  /**
   * Get ride location
   */
  static async getRideLocation(rideId: string): Promise<{ lat: number; lng: number; timestamp: string } | null> {
    const key = REDIS_KEYS.RIDE_TRACKING(rideId);
    return await RedisHelper.get(key);
  }

  /**
   * Manage Ride OTP in Redis
   */
  static async setRideOTP(rideId: string, otp: string): Promise<void> {
    const key = REDIS_KEYS.RIDE_OTP(rideId);
    await RedisHelper.set(key, otp, REDIS_TTL.RIDE_OTP);
  }

  static async getRideOTP(rideId: string): Promise<string | null> {
    const key = REDIS_KEYS.RIDE_OTP(rideId);
    return await RedisHelper.get<string>(key);
  }

  /**
   * Clear ride data from Redis
   */
  static async clearRideData(rideId: string): Promise<void> {
    await Promise.all([
      RedisHelper.delete(REDIS_KEYS.ACTIVE_RIDE(rideId)),
      RedisHelper.delete(REDIS_KEYS.RIDE_TRACKING(rideId)),
      RedisHelper.delete(REDIS_KEYS.RIDE_OTP(rideId)),
    ]);
  }
}
