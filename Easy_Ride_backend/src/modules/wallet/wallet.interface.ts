import { Document, Types } from 'mongoose';

export interface IWallet {
  user: Types.ObjectId;
  balance: number;
  currency: string;
  isBlocked: boolean;
  lastTransaction?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWalletDocument extends IWallet, Document {}
