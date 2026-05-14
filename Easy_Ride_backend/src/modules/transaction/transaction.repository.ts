import { ClientSession, Types } from 'mongoose';
import { Transaction } from './transaction.model';
import { ITransaction } from './transaction.interface';

export class TransactionRepository {
  /**
   * Create a new transaction
   */
  async create(transactionData: Partial<ITransaction>, session?: ClientSession) {
    const transaction = new Transaction(transactionData);
    return await transaction.save({ session });
  }

  /**
   * Find transaction by ID
   */
  async findById(id: string | Types.ObjectId) {
    return await Transaction.findById(id).populate('user rider ride');
  }

  /**
   * Find transaction by Gateway Order ID
   */
  async findByGatewayOrderId(orderId: string) {
    return await Transaction.findOne({ gatewayOrderId: orderId });
  }

  /**
   * Update transaction status
   */
  async updateStatus(
    id: string | Types.ObjectId, 
    status: string, 
    gatewayPaymentId?: string, 
    gatewaySignature?: string,
    session?: ClientSession
  ) {
    const update: any = { status };
    if (gatewayPaymentId) update.gatewayPaymentId = gatewayPaymentId;
    if (gatewaySignature) update.gatewaySignature = gatewaySignature;
    
    return await Transaction.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, session }
    );
  }

  /**
   * Get user transaction history
   */
  async getUserTransactions(userId: string | Types.ObjectId, limit: number = 20, skip: number = 0) {
    return await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('ride');
  }

  /**
   * Get rider earnings/transactions
   */
  async getRiderTransactions(riderId: string | Types.ObjectId, limit: number = 20, skip: number = 0) {
    return await Transaction.find({ rider: riderId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('ride');
  }
}
