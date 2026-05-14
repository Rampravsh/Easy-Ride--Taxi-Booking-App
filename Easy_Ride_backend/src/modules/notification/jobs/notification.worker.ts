import { Worker, Job } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../queues/notification.queue';
import { FirebaseProvider } from '../providers/firebase.provider';
import { EmailProvider } from '../providers/email.provider';
import { SmsProvider } from '../providers/sms.provider';
import { DeliveryType, NotificationStatus } from '../../../shared/enums';
import { Notification } from '../notification.model';
import logger from '../../../shared/utils/logger';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

/**
 * Worker to process notification jobs
 */
export const notificationWorker = new Worker(
  NOTIFICATION_QUEUE,
  async (job: Job) => {
    const { notificationId, tokens, email, phone, title, body, data, deliveryType } = job.data;

    logger.info(`Processing Notification Job: ${job.id} for ID: ${notificationId}`);

    try {
      // 1. Send via requested delivery types
      const sendPromises = deliveryType.map(async (type: string) => {
        switch (type) {
          case DeliveryType.PUSH:
            if (tokens && tokens.length > 0) {
              const firebaseProvider = new FirebaseProvider();
              return firebaseProvider.sendPushNotification(tokens, title, body, data);
            }
            break;
          case DeliveryType.EMAIL:
            if (email) {
              const emailProvider = new EmailProvider();
              return emailProvider.sendEmail(email, title, body);
            }
            break;
          case DeliveryType.SMS:
            if (phone) {
              const smsProvider = new SmsProvider();
              return smsProvider.sendSms(phone, body);
            }
            break;

          default:
            break;
        }
      });

      await Promise.all(sendPromises);

      // 2. Update status in DB
      await Notification.findByIdAndUpdate(notificationId, {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      });

      logger.info(`✅ Notification Sent Successfully: ${notificationId}`);
    } catch (error: any) {
      logger.error(`❌ Notification Job Failed: ${job.id}`, error);
      
      // Update DB with failure reason
      await Notification.findByIdAndUpdate(notificationId, {
        status: NotificationStatus.FAILED,
        failedReason: error.message,
        $inc: { retryCount: 1 },
      });

      throw error; // Re-throw to trigger BullMQ retry
    }
  },
  { connection }
);

notificationWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed!`);
});

notificationWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed with ${err.message}`);
});
