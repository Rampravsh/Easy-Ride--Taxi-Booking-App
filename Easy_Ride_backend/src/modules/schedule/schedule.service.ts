import { Types } from 'mongoose';
import { ScheduledRide } from './schedule.model';
import { IScheduledRide } from './schedule.interface';
import { ScheduleStatus } from '../../shared/enums';
import { scheduledRideQueue, reminderQueue } from './queues/scheduledRide.queue';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import dayjs from 'dayjs';

export class ScheduleService {
  /**
   * Create a scheduled ride
   */
  async createSchedule(params: {
    rideId: string;
    scheduledAt: Date;
    autoAssigned?: boolean;
  }) {
    const { rideId, scheduledAt, autoAssigned = true } = params;

    // 1. Validate schedule time (must be at least 30 mins from now)
    const now = dayjs();
    const scheduledTime = dayjs(scheduledAt);
    if (scheduledTime.isBefore(now.add(25, 'minute'))) {
      throw new ApiError('Scheduled rides must be booked at least 30 minutes in advance', httpStatus.BAD_REQUEST);
    }

    // 2. Calculate activation and reminder times
    const activationTime = scheduledTime.subtract(10, 'minute').toDate(); // Start matching 10 mins before
    const reminderTime = scheduledTime.subtract(30, 'minute').toDate(); // Remind 30 mins before
    const cancellationDeadline = scheduledTime.subtract(1, 'hour').toDate();

    // 3. Persist Schedule
    const schedule = await ScheduledRide.create({
      ride: new Types.ObjectId(rideId),
      scheduledAt,
      status: ScheduleStatus.SCHEDULED,
      activationTime,
      cancellationDeadline,
      autoAssigned,
    });

    // 4. Add Jobs to BullMQ
    // Activation Job (Delayed)
    const activationDelay = dayjs(activationTime).diff(now);
    await scheduledRideQueue.add(
      'activate-ride',
      { scheduleId: schedule._id, rideId },
      { delay: Math.max(0, activationDelay) }
    );

    // Reminder Job (Delayed)
    const reminderDelay = dayjs(reminderTime).diff(now);
    if (reminderDelay > 0) {
      await reminderQueue.add(
        'send-reminder',
        { scheduleId: schedule._id, rideId },
        { delay: reminderDelay }
      );
    }

    return schedule;
  }

  /**
   * Cancel a scheduled ride
   */
  async cancelSchedule(scheduleId: string, userId: string) {
    const schedule = await ScheduledRide.findById(scheduleId).populate('ride');
    if (!schedule) {
      throw new ApiError('Schedule not found', httpStatus.NOT_FOUND);
    }

    // Check ownership (simplified)
    const ride: any = schedule.ride;
    if (ride.user.toString() !== userId) {
      throw new ApiError('Unauthorized', httpStatus.FORBIDDEN);
    }

    // Check cancellation deadline
    if (dayjs().isAfter(dayjs(schedule.cancellationDeadline))) {
      // Apply cancellation fee logic here
    }

    schedule.status = ScheduleStatus.CANCELLED;
    await schedule.save();

    // In production, we should also remove jobs from the queue if possible
    // or handle the 'CANCELLED' status in the worker.
    
    return schedule;
  }

  /**
   * Get user schedules
   */
  async getSchedules(userId: string) {
    return await ScheduledRide.find()
      .populate({
        path: 'ride',
        match: { user: userId }
      })
      .sort({ scheduledAt: 1 });
  }
}
