import { Document, Types } from 'mongoose';
import { CallType, CallStatus } from '../../shared/enums';

export interface ICall {
  ride: Types.ObjectId;
  caller: Types.ObjectId;
  receiver: Types.ObjectId;
  callType: CallType;
  status: CallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  twilioRoomId?: string;
  twilioSid?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICallDocument extends ICall, Document {}
