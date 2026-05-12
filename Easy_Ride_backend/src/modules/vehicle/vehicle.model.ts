import mongoose, { Schema, Document } from 'mongoose';
import { VehicleType } from '../../shared/enums';

export interface IVehicle extends Document {
  rider: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  type: VehicleType;
  image?: string;
  isVerified: boolean;
}

const vehicleSchema: Schema = new Schema(
  {
    rider: { type: Schema.Types.ObjectId, ref: 'Rider', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    image: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>('Vehicle', vehicleSchema);
