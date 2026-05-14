import { Document, Types } from 'mongoose';
import { ScheduleStatus } from '../../shared/enums';

export interface IScheduledRide {
  ride: Types.ObjectId;
  scheduledAt: Date;
  status: ScheduleStatus;
  reminderSent: boolean;
  autoAssigned: boolean;
  assignedRider?: Types.ObjectId;
  activationTime: Date; // Time when the ride should start looking for riders
  cancellationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduledRideDocument extends IScheduledRide, Document {}
