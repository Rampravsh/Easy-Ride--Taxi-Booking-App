import mongoose, { Schema, Document } from 'mongoose';

export interface IRider extends Document {
  user: mongoose.Types.ObjectId;
  licenseNumber: string;
  vehicle: mongoose.Types.ObjectId;
  isOnline: boolean;
  currentLocation: {
    type: string;
    coordinates: number[];
  };
  lastActive: Date;
  isApproved: boolean;
  totalEarnings: number;
}

const riderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    licenseNumber: { type: String, required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    isOnline: { type: Boolean, default: false },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    lastActive: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IRider>('Rider', riderSchema);
