import mongoose, { Schema } from 'mongoose';
import { 
  IVehicle, 
  VehicleType, 
  VehicleCategory, 
  FuelType 
} from './vehicle.interface';
import { VerificationStatus } from '../rider/rider.interface';

const vehicleDocumentSchema = new Schema({
  url: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING,
  },
  uploadedAt: { type: Date, default: Date.now },
});

const vehicleSchema: Schema = new Schema(
  {
    rider: { type: Schema.Types.ObjectId, ref: 'Rider', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(VehicleCategory),
      required: true,
      index: true,
    },
    brand: { type: String, required: true, trim: true },
    modelName: { type: String, required: true, trim: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
    numberPlate: { type: String, required: true, unique: true, uppercase: true, trim: true },
    seatingCapacity: { type: Number, required: true, min: 1 },
    fuelType: {
      type: String,
      enum: Object.values(FuelType),
      required: true,
    },
    vehicleImage: { type: String },
    documents: {
      rcBook: vehicleDocumentSchema,
      insurance: vehicleDocumentSchema,
      pollution: vehicleDocumentSchema,
      permit: vehicleDocumentSchema,
      fitnessCertificate: vehicleDocumentSchema,
    },
    isVerified: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: false, index: true },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common queries
vehicleSchema.index({ rider: 1, isActive: 1 });
vehicleSchema.index({ type: 1, category: 1 });

const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
