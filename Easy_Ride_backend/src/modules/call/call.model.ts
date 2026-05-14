import { Schema, model } from 'mongoose';
import { ICallDocument } from './call.interface';
import { CallType, CallStatus } from '../../shared/enums';

const callSchema = new Schema<ICallDocument>(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    caller: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    callType: {
      type: String,
      enum: Object.values(CallType),
      default: CallType.AUDIO,
    },
    status: {
      type: String,
      enum: Object.values(CallStatus),
      default: CallStatus.INITIATED,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number,
      default: 0,
    },
    twilioRoomId: {
      type: String,
    },
    twilioSid: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });

export const Call = model<ICallDocument>('Call', callSchema);
