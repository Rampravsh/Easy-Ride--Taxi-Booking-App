import { Types } from 'mongoose';
import { ScheduledRide } from './schedule.model';
import { IScheduledRide } from './schedule.interface';
import { ScheduleStatus, NotificationType, DeliveryType, RecipientType } from '../../shared/enums';
import { scheduledRideQueue, reminderQueue } from './queues/scheduledRide.queue';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import dayjs from 'dayjs';
import logger from '../../shared/utils/logger';
import { NotificationService } from '../notification/notification.service';
import { SCHEDULE_CONFIG } from '../../shared/constants/app.constants';

const notificationService = new NotificationService();

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

    if (scheduledTime.isBefore(now.add(SCHEDULE_CONFIG.MIN_ADVANCE_MINUTES - 5, 'minute'))) {
      throw new ApiError(
        `Scheduled rides must be booked at least ${SCHEDULE_CONFIG.MIN_ADVANCE_MINUTES} minutes in advance`,
        httpStatus.BAD_REQUEST
      );
    }

    // 2. Calculate activation and reminder times
    const activationTime = scheduledTime
      .subtract(SCHEDULE_CONFIG.ACTIVATION_BEFORE_MINUTES, 'minute')
      .toDate();
    const reminderTime = scheduledTime
      .subtract(SCHEDULE_CONFIG.REMINDER_BEFORE_MINUTES, 'minute')
      .toDate();
    const cancellationDeadline = scheduledTime
      .subtract(SCHEDULE_CONFIG.CANCELLATION_BEFORE_HOURS, 'hour')
      .toDate();

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
    const activationDelay = dayjs(activationTime).diff(now);
    await scheduledRideQueue.add(
      'activate-ride',
      { scheduleId: schedule._id, rideId },
      { delay: Math.max(0, activationDelay) }
    );

    const reminderDelay = dayjs(reminderTime).diff(now);
    if (reminderDelay > 0) {
      await reminderQueue.add(
        'send-reminder',
        { scheduleId: schedule._id, rideId },
        { delay: reminderDelay }
      );
    }

    logger.info(`Scheduled ride created: ${schedule._id} for rideId: ${rideId}`);
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

    // Check ownership
    const ride: any = schedule.ride;
    if (ride.user.toString() !== userId) {
      throw new ApiError('Unauthorized', httpStatus.FORBIDDEN);
    }

    if (schedule.status === ScheduleStatus.CANCELLED) {
      throw new ApiError('Schedule already cancelled', httpStatus.BAD_REQUEST);
    }

    if (schedule.status === ScheduleStatus.COMPLETED) {
      throw new ApiError('Cannot cancel a completed scheduled ride', httpStatus.BAD_REQUEST);
    }

    // Cancellation fee: if past deadline, apply fee (stub — wire to WalletService)
    const isPastDeadline = dayjs().isAfter(dayjs(schedule.cancellationDeadline));
    if (isPastDeadline) {
      // TODO: Apply cancellation fee via WalletService.debitWallet
      logger.warn(`Late cancellation of schedule ${scheduleId} — fee applicable`);
    }

    schedule.status = ScheduleStatus.CANCELLED;
    await schedule.save();

    // Notify user
    notificationService
      .sendNotification({
        recipientId: ride.user.toString(),
        recipientType: RecipientType.USER,
        title: 'Scheduled Ride Cancelled',
        body: `Your scheduled ride for ${dayjs(schedule.scheduledAt).format('MMM D, h:mm A')} has been cancelled.`,
        notificationType: NotificationType.SCHEDULE_REMINDER,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { scheduleId, status: ScheduleStatus.CANCELLED },
      })
      .catch((err) => logger.error('Notification failed (cancelSchedule):', err));

    logger.info(`Schedule cancelled: ${scheduleId} by user: ${userId}`);
    return schedule;
  }

  /**
   * Get schedules for a specific user
   *
   * Fixed: Previous implementation used .populate({ match }) which does NOT
   * filter at the DB level — it fetches all schedules and filters post-hydration,
   * causing null rides in results. Correct approach: find rides by user first.
   */
  async getSchedules(userId: string) {
    const Ride = (await import('../ride/ride.model')).default;

    // 1. Get all ride IDs belonging to this user
    const userRides = await Ride.find({ user: userId }).select('_id').lean();
    const rideIds = userRides.map((r) => r._id);

    // 2. Find schedules for those rides
    return await ScheduledRide.find({ ride: { $in: rideIds } })
      .populate('ride')
      .sort({ scheduledAt: 1 });
  }
}
