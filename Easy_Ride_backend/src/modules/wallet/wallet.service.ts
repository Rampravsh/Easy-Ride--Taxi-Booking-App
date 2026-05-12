import Wallet from './wallet.model';
import WalletTransaction, { TransactionType } from './walletTransaction.model';
import { AppError } from '../../middlewares/error.middleware';
import mongoose from 'mongoose';

export class WalletService {
  async getWallet(userId: string) {
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0 });
    }
    return wallet;
  }

  async addFunds(userId: string, amount: number, description: string = 'Deposit') {
    const wallet = await this.getWallet(userId);
    
    wallet.balance += amount;
    await wallet.save();

    await WalletTransaction.create({
      wallet: wallet._id,
      amount,
      type: TransactionType.DEPOSIT,
      description,
    });

    return wallet;
  }

  async deductFunds(userId: string, amount: number, description: string) {
    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new AppError('Insufficient wallet balance', 400);
    }

    wallet.balance -= amount;
    await wallet.save();

    await WalletTransaction.create({
      wallet: wallet._id,
      amount,
      type: TransactionType.PAYMENT,
      description,
    });

    return wallet;
  }

  async getTransactions(userId: string) {
    const wallet = await this.getWallet(userId);
    return await WalletTransaction.find({ wallet: wallet._id }).sort({ createdAt: -1 });
  }
}
