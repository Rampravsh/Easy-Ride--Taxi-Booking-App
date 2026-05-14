import { Request, Response } from 'express';
import { WalletService } from './wallet.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import httpStatus from 'http-status';
import { TransactionService } from '../transaction/transaction.service';
import { AuthRequest } from '../../shared/types/express.types';
import { ApiError } from '../../shared/errors/ApiError';

const walletService = new WalletService();
const transactionService = new TransactionService();

export class WalletController {
  /**
   * Get wallet balance
   */
  static getWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }
    const wallet = await walletService.getOrCreateWallet(userId);
    return ApiResponse.success(res, 'Wallet fetched successfully', wallet);
  });

  /**
   * Get wallet transactions
   */
  static getWalletTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError('User not found', httpStatus.UNAUTHORIZED);
    }
    const { page = 1, limit = 20 } = req.query;
    const transactions = await transactionService.getUserTransactions(
      userId.toString(), 
      Number(page), 
      Number(limit)
    );
    return ApiResponse.success(res, 'Wallet transactions fetched successfully', transactions);
  });
}

