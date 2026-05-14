import { Queue } from 'bullmq';
import RedisService from '../../../config/redis';
import logger from '../../../shared/utils/logger';

// Essential for BullMQ: share the ioredis instance or use a compatible one
const connection = RedisService.getInstance();

export const scheduledRideQueue = new Queue('scheduled-rides', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const reminderQueue = new Queue('ride-reminders', { connection });

logger.info('Scheduled Ride Queues initialized');
