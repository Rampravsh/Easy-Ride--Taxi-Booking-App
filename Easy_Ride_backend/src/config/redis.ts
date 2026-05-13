import Redis, { RedisOptions } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null, // Essential for BullMQ and long-running connections
};

class RedisService {
  private static instance: Redis;
  private static subscriberInstance: Redis;

  private constructor() {}

  /**
   * Get primary Redis instance (Singleton)
   */
  public static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis(redisOptions);

      RedisService.instance.on('connect', () => {
        console.log('✅ Redis Connected');
      });

      RedisService.instance.on('error', (err) => {
        console.error('❌ Redis Error:', err);
      });
    }
    return RedisService.instance;
  }

  /**
   * Get subscriber Redis instance (for Pub/Sub)
   */
  public static getSubscriberInstance(): Redis {
    if (!RedisService.subscriberInstance) {
      RedisService.subscriberInstance = new Redis(redisOptions);
    }
    return RedisService.subscriberInstance;
  }

  /**
   * Health Check
   */
  public static async healthCheck(): Promise<boolean> {
    try {
      const client = RedisService.getInstance();
      const response = await client.ping();
      return response === 'PONG';
    } catch (error) {
      return false;
    }
  }

  /**
   * Graceful Shutdown
   */
  public static async shutdown(): Promise<void> {
    if (RedisService.instance) {
      await RedisService.instance.quit();
      console.log('Disconnected from Redis');
    }
    if (RedisService.subscriberInstance) {
      await RedisService.subscriberInstance.quit();
      console.log('Disconnected from Redis Subscriber');
    }
  }
}

export const redis = RedisService.getInstance();
export const redisSubscriber = RedisService.getSubscriberInstance();
export default RedisService;
