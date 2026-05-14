import { Types } from 'mongoose';
import { TransactionRepository } from './transaction.repository';

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: string) {
    return await this.transactionRepository.findById(id);
  }

  /**
   * Get user transaction history with pagination
   */
  async getUserTransactions(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await this.transactionRepository.getUserTransactions(userId, limit, skip);
  }

  /**
   * Get rider transactions/earnings with pagination
   */
  async getRiderTransactions(riderId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await this.transactionRepository.getRiderTransactions(riderId, limit, skip);
  }
}
