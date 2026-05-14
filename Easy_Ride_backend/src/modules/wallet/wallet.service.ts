import { ClientSession, Types } from 'mongoose';
import { WalletRepository } from './wallet.repository';
import { TransactionRepository } from '../transaction/transaction.repository';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import { TransactionType, TransactionCategory, TransactionStatus } from '../../shared/enums';

export class WalletService {
  private walletRepository: WalletRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.walletRepository = new WalletRepository();
    this.transactionRepository = new TransactionRepository();
  }

  /**
   * Get wallet by user ID, create if doesn't exist
   */
  async getOrCreateWallet(userId: string | Types.ObjectId, session?: ClientSession) {
    let wallet = await this.walletRepository.findByUserId(userId, session);
    if (!wallet) {
      wallet = await this.walletRepository.create({ user: new Types.ObjectId(userId) }, session);
    }
    return wallet;
  }

  /**
   * Credit money to wallet
   */
  async creditWallet(
    userId: string | Types.ObjectId,
    amount: number,
    category: TransactionCategory,
    description: string,
    metadata?: any,
    session?: ClientSession
  ) {
    const wallet = await this.getOrCreateWallet(userId, session);

    if (wallet.isBlocked) {
      throw new ApiError('Wallet is blocked', httpStatus.FORBIDDEN);
    }

    // 1. Update Balance
    const updatedWallet = await this.walletRepository.updateBalance(userId, amount, session);
    if (!updatedWallet) {
      throw new ApiError('Failed to update wallet balance', httpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2. Create Transaction Audit
    const transaction = await this.transactionRepository.create({
      user: new Types.ObjectId(userId),
      wallet: updatedWallet._id as Types.ObjectId,
      amount,
      transactionType: TransactionType.CREDIT,
      transactionCategory: category,
      status: TransactionStatus.SUCCESS,
      description,
      metadata,
    }, session);

    // 3. Update Last Transaction Reference
    await this.walletRepository.updateLastTransaction(userId, transaction._id as Types.ObjectId, session);

    return { wallet: updatedWallet, transaction };
  }

  /**
   * Debit money from wallet
   */
  async debitWallet(
    userId: string | Types.ObjectId,
    amount: number,
    category: TransactionCategory,
    description: string,
    metadata?: any,
    session?: ClientSession
  ) {
    const wallet = await this.getOrCreateWallet(userId, session);

    if (wallet.isBlocked) {
      throw new ApiError('Wallet is blocked', httpStatus.FORBIDDEN);
    }

    if (wallet.balance < amount) {
      throw new ApiError('Insufficient wallet balance', httpStatus.BAD_REQUEST);
    }

    // 1. Update Balance (using negative amount for debit)
    const updatedWallet = await this.walletRepository.updateBalance(userId, -amount, session);
    if (!updatedWallet) {
      throw new ApiError('Failed to update wallet balance', httpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2. Create Transaction Audit
    const transaction = await this.transactionRepository.create({
      user: new Types.ObjectId(userId),
      wallet: updatedWallet._id as Types.ObjectId,
      amount,
      transactionType: TransactionType.DEBIT,
      transactionCategory: category,
      status: TransactionStatus.SUCCESS,
      description,
      metadata,
    }, session);

    // 3. Update Last Transaction Reference
    await this.walletRepository.updateLastTransaction(userId, transaction._id as Types.ObjectId, session);

    return { wallet: updatedWallet, transaction };
  }

  /**
   * Lock/Unlock wallet
   */
  async toggleWalletLock(userId: string | Types.ObjectId, isBlocked: boolean) {
    return await this.walletRepository.updateLockStatus(userId, isBlocked);
  }
}
