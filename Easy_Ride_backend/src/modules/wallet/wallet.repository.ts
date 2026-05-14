import { ClientSession, Types } from 'mongoose';
import { Wallet } from './wallet.model';
import { IWallet } from './wallet.interface';

export class WalletRepository {
  /**
   * Find wallet by user ID
   */
  async findByUserId(userId: string | Types.ObjectId, session?: ClientSession) {
    return await Wallet.findOne({ user: userId }).session(session || null);
  }

  /**
   * Create a new wallet for a user
   */
  async create(walletData: Partial<IWallet>, session?: ClientSession) {
    const wallet = new Wallet(walletData);
    return await wallet.save({ session });
  }

  /**
   * Update wallet balance atomically
   */
  async updateBalance(userId: string | Types.ObjectId, amount: number, session?: ClientSession) {
    return await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: amount } },
      { new: true, session, runValidators: true }
    );
  }

  /**
   * Update last transaction ID
   */
  async updateLastTransaction(userId: string | Types.ObjectId, transactionId: Types.ObjectId, session?: ClientSession) {
    return await Wallet.findOneAndUpdate(
      { user: userId },
      { lastTransaction: transactionId },
      { new: true, session }
    );
  }

  /**
   * Lock or unlock wallet
   */
  async updateLockStatus(userId: string | Types.ObjectId, isBlocked: boolean, session?: ClientSession) {
    return await Wallet.findOneAndUpdate(
      { user: userId },
      { isBlocked },
      { new: true, session }
    );
  }
}
