import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  ride: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
}

const messageSchema: Schema = new Schema(
  {
    ride: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', messageSchema);
