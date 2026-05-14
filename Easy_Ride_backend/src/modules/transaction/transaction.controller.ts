import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/utils/apiResponse';
import httpStatus from 'http-status';
import { AuthRequest } from '../../shared/types/express.types';
import { ApiError } from '../../shared/errors/ApiError';

const transactionService = new TransactionService();

export class TransactionController {
  /**
   * Get transaction details
   */
  static getTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const transaction = await transactionService.getTransactionById(transactionId as string);
    if (!transaction) {
      throw new ApiError('Transaction not found', httpStatus.NOT_FOUND);
    }
    return ApiResponse.success(res, 'Transaction fetched successfully', transaction);
  });


  /**
   * Get my transactions
   */
  static getMyTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
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
    return ApiResponse.success(res, 'Transactions fetched successfully', transactions);
  });
}

