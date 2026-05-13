import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole } from '../../shared/enums';

export interface IUser extends Document {
  firebaseUID: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  ratings: number;
  numReviews: number;
  walletBalance: number;
  fcmToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    firebaseUID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    fcmToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password!, 12);
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
