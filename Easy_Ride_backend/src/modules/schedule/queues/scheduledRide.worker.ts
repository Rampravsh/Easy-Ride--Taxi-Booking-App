import { Worker, Job } from 'bullmq';
import { redis as redisConnection } from '../../../config/redis';

import { ScheduledRide } from '../schedule.model';
import { RideService } from '../../ride/ride.service';
import { ScheduleStatus } from '../../../shared/enums';
import logger from '../../../shared/utils/logger';

const rideService = new RideService();

export const scheduledRideWorker = new Worker(
  'scheduled-ride-queue',
  async (job: Job) => {
    const { scheduleId, rideId } = job.data;
    logger.info(`Activating scheduled ride: ${rideId}`);

    const schedule = await ScheduledRide.findById(scheduleId);
    if (!schedule || schedule.status !== ScheduleStatus.SCHEDULED) {
      logger.warn(`Schedule ${scheduleId} is not active or not found. skipping.`);
      return;
    }

    try {
      // Logic to start matching/assigning the ride
      await rideService.activateScheduledRide(rideId);

      
      schedule.status = ScheduleStatus.COMPLETED;
      await schedule.save();
      
      logger.info(`Successfully activated scheduled ride: ${rideId}`);
    } catch (error) {
      logger.error(`Error activating scheduled ride ${rideId}:`, error);
      throw error;
    }
  },
  { connection: redisConnection }
);

export const reminderWorker = new Worker(
  'reminder-queue',
  async (job: Job) => {
    const { scheduleId, rideId } = job.data;
    logger.info(`Sending reminder for scheduled ride: ${rideId}`);
    // Implement notification logic here
  },
  { connection: redisConnection }
);
