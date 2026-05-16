import { Document, Types } from 'mongoose';
import { TransactionType, TransactionCategory, TransactionStatus, PaymentGateway } from '../../shared/enums';

export interface ITransaction {
  user: Types.ObjectId;
  rider?: Types.ObjectId;
  wallet?: Types.ObjectId;
  ride?: Types.ObjectId;
  /**
   * Use PaymentGateway enum from shared/enums.
   * Typed as string union for backward compat with existing records.
   */
  paymentGateway?: PaymentGateway | 'stripe';
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
