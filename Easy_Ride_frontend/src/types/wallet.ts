export interface Wallet {
  _id: string;
  user: string;
  balance: number;
  currency: string;
  isBlocked: boolean;
  lastTransaction?: string;
  createdAt: string;
  updatedAt: string;
}
