import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../../shared/enums';
import { IUser, AuthProvider } from './user.interface';

export { IUser };

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const savedAddressSchema = new Schema({
  label: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: pointSchema,
    index: '2dsphere', // Enable geospatial queries
  },
});

const emergencyContactSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true },
});

const userSchema: Schema = new Schema(
  {
    firebaseUID: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    profileImage: { type: String },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.FIREBASE,
    },
    walletBalance: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalRides: { type: Number, default: 0 },
    savedAddresses: [savedAddressSchema],
    deviceTokens: [{ type: String }],
    isBlocked: { type: Boolean, default: false },
    preferences: {
      notifications: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      language: { type: String, default: 'en' },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
    },
    emergencyContacts: [emergencyContactSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ firebaseUID: 1 });

// Static methods or instance methods can be added here if needed

const User = mongoose.model<IUser>('User', userSchema);

export default User;
