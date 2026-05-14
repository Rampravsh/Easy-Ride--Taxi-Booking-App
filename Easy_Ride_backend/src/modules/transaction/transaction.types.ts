import { ITransaction } from './transaction.interface';

export type TransactionFilter = {
  user?: string;
  rider?: string;
  status?: string;
  transactionType?: string;
};

export type TransactionSummary = Pick<ITransaction, 'amount' | 'currency' | 'status' | 'createdAt'>;
