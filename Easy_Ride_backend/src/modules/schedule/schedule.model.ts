import { Schema, model } from 'mongoose';
import { IScheduledRideDocument } from './schedule.interface';
import { ScheduleStatus } from '../../shared/enums';

const scheduledRideSchema = new Schema<IScheduledRideDocument>(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ScheduleStatus),
      default: ScheduleStatus.SCHEDULED,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    autoAssigned: {
      type: Boolean,
      default: true,
    },
    assignedRider: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
    },
    activationTime: {
      type: Date,
      required: true,
    },
    cancellationDeadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ScheduledRide = model<IScheduledRideDocument>('ScheduledRide', scheduledRideSchema);
