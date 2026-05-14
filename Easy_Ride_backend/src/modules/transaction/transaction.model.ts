import { Schema, model } from 'mongoose';
import { ITransactionDocument } from './transaction.interface';
import { TransactionType, TransactionCategory, TransactionStatus } from '../../shared/enums';

const transactionSchema = new Schema<ITransactionDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    ride: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
    },
    paymentGateway: {
      type: String,
      enum: ['razorpay', 'manual', 'system'],
      default: 'system',
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    transactionCategory: {
      type: String,
      enum: Object.values(TransactionCategory),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    gatewayOrderId: {
      type: String,
    },
    gatewayPaymentId: {
      type: String,
    },
    gatewaySignature: {
      type: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ gatewayOrderId: 1 });
transactionSchema.index({ status: 1 });

export const Transaction = model<ITransactionDocument>('Transaction', transactionSchema);
