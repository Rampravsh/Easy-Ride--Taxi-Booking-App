import { IWallet } from './wallet.interface';

export type WalletUpdateData = Partial<Omit<IWallet, 'user' | '_id'>>;

export type WalletBalanceResponse = {
  userId: string;
  balance: number;
  currency: string;
};
