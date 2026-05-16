import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../../shared/enums';
import { AuthProvider } from '../user/user.interface';
import { IRider, VerificationStatus } from './rider.interface';

const documentSchema = new Schema({
  url: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING,
  },
  uploadedAt: { type: Date, default: Date.now },
});

const riderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    firebaseUID: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: [UserRole.RIDER],
      default: UserRole.RIDER,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true, trim: true },
    licenseNumber: { type: String },
    profileImage: { type: String },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.FIREBASE,
    },
    isOnline: { type: Boolean, default: false, index: true },
    isAvailable: { type: Boolean, default: false, index: true },
    currentRide: { type: Schema.Types.ObjectId, ref: 'Ride' },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0],
      },
    },
    walletBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5.0, min: 0, max: 5 },
    deviceTokens: [{ type: String }],
    emergencyMode: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },
    documents: {
      drivingLicense: documentSchema,
      insurance: documentSchema,
      rcBook: documentSchema,
      aadhaar: documentSchema,
      profilePhoto: documentSchema,
    },
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mandatory Geospatial Index
riderSchema.index({ currentLocation: '2dsphere' });

// Compound indexes for searching nearby available riders
riderSchema.index({ isOnline: 1, isAvailable: 1, verificationStatus: 1 });

const Rider = mongoose.model<IRider>('Rider', riderSchema);

export default Rider;
