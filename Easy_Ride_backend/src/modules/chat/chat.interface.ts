import { Document, Types } from 'mongoose';
import { MessageType, MessageStatus } from '../../shared/enums';

export interface IMessage {
  ride: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  messageType: MessageType;
  content: string;
  status: MessageStatus;
  metadata?: Record<string, any>;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends IMessage, Document {}
