import { Schema, model } from 'mongoose';
import { IMessageDocument } from './chat.interface';
import { MessageType, MessageStatus } from '../../shared/enums';

const messageSchema = new Schema<IMessageDocument>(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.SENT,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    deliveredAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
messageSchema.index({ ride: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, status: 1 });

export const Message = model<IMessageDocument>('Message', messageSchema);
