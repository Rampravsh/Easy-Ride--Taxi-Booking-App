import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../../../config/redis';
import logger from '../../../shared/utils/logger';

// Queue Name
export const NOTIFICATION_QUEUE = 'notification-queue';

// Connection Options
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Create Queue
export const notificationQueue = new Queue(NOTIFICATION_QUEUE, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

logger.info(`✅ Notification Queue Initialized: ${NOTIFICATION_QUEUE}`);
