import { Schema, model } from 'mongoose';
import { IWalletDocument } from './wallet.interface';

const walletSchema = new Schema<IWalletDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    lastTransaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries handled by unique: true on user field


export const Wallet = model<IWalletDocument>('Wallet', walletSchema);
