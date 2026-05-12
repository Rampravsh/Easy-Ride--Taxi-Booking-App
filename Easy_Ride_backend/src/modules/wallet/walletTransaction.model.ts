import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PAYMENT = 'payment',
  REFUND = 'refund',
}

export interface IWalletTransaction extends Document {
  wallet: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  description: string;
  referenceId?: string;
  status: string;
}

const walletTransactionSchema: Schema = new Schema(
  {
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    description: { type: String, required: true },
    referenceId: { type: String },
    status: { type: String, default: 'completed' },
  },
  { timestamps: true }
);

export default mongoose.model<IWalletTransaction>('WalletTransaction', walletTransactionSchema);
