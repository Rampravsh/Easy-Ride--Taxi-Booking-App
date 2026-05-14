import { Document, Types } from 'mongoose';
import { TransactionType, TransactionCategory, TransactionStatus } from '../../shared/enums';

export interface ITransaction {
  user: Types.ObjectId;
  rider?: Types.ObjectId;
  wallet?: Types.ObjectId;
  ride?: Types.ObjectId;
  paymentGateway?: 'razorpay' | 'manual' | 'system';
  transactionType: TransactionType;
  transactionCategory: TransactionCategory;
  amount: number;
  currency: string;
  status: TransactionStatus;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  metadata?: Record<string, any>;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionDocument extends ITransaction, Document {}
