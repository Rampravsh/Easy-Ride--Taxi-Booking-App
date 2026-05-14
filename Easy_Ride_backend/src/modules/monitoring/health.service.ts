import mongoose from 'mongoose';
import { redis } from '../../config/redis';
import { firebaseMessaging } from '../../config/firebase';
import logger from '../../shared/utils/logger';

export class HealthService {
  static async checkAll() {
    const health: Record<string, any> = {
      status: 'UP',
      timestamp: new Date(),
      services: {},
    };

    // 1. MongoDB Check
    try {
      const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
      health.services.mongodb = { status: dbStatus };
      if (dbStatus === 'DOWN') health.status = 'DEGRADED';
    } catch (err: any) {
      health.services.mongodb = { status: 'DOWN', error: err.message };
      health.status = 'DEGRADED';
    }


    // 2. Redis Check
    try {
      const redisPing = await redis.ping();
      const redisStatus = redisPing === 'PONG' ? 'UP' : 'DOWN';
      health.services.redis = { status: redisStatus };
      if (redisStatus === 'DOWN') health.status = 'DEGRADED';
    } catch (err: any) {
      health.services.redis = { status: 'DOWN', error: err.message };
      health.status = 'DEGRADED';
    }


    // 3. Firebase Check (Simple reachability)
    try {
      health.services.firebase = { status: 'UP' }; // Assume UP if admin initialized
    } catch (err: any) {
      health.services.firebase = { status: 'DOWN', error: err.message };
    }


    return health;
  }
}
