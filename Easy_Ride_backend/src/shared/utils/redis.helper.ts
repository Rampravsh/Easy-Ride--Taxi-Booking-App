import { redis } from '../../config/redis';

export class RedisHelper {
  /**
   * Basic Get/Set
   */
  static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  /**
   * Hash Operations
   */
  static async hSet(key: string, field: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.hset(key, field, stringValue);
  }

  static async hGet<T>(key: string, field: string): Promise<T | null> {
    const data = await redis.hget(key, field);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  /**
   * Geo Operations (Crucial for Ride Matching)
   */
  static async geoAdd(key: string, lng: number, lat: number, member: string): Promise<void> {
    await redis.geoadd(key, lng, lat, member);
  }

  static async geoRemove(key: string, member: string): Promise<void> {
    await redis.zrem(key, member);
  }

  /**
   * Find nearby members within radius (meters)
   */
  static async geoSearch(key: string, lng: number, lat: number, radiusMeters: number): Promise<string[]> {
    // GEORADIUS returns string[] when called without extra options.
    // Explicit casting is required for ioredis type compatibility.
    return (await redis.georadius(key, lng, lat, radiusMeters, 'm')) as string[];
  }

  /**
   * Pub/Sub
   */
  static async publish(channel: string, message: any): Promise<void> {
    const stringMessage = typeof message === 'string' ? message : JSON.stringify(message);
    await redis.publish(channel, stringMessage);
  }

  /**
   * List Operations (Queues)
   */
  static async lPush(key: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.lpush(key, stringValue);
  }

  static async rPop<T>(key: string): Promise<T | null> {
    const data = await redis.rpop(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }
}
