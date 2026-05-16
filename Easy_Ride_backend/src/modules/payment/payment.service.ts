import { Types, startSession } from 'mongoose';
import { RazorpayProvider } from './providers/razorpay.provider';

import { TransactionRepository } from '../transaction/transaction.repository';
import { WalletService } from '../wallet/wallet.service';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import { TransactionType, TransactionCategory, TransactionStatus, PaymentGateway } from '../../shared/enums';

export class PaymentService {
  private transactionRepository: TransactionRepository;
  private walletService: WalletService;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.walletService = new WalletService();
  }

  /**
   * Create Razorpay Order for Wallet Topup
   */
  async createTopupOrder(userId: string, amount: number) {
    // 1. Create Razorpay Order
    const receipt = `topup_${Date.now()}_${userId.toString().slice(-4)}`;
    const order = await RazorpayProvider.createOrder(amount, 'INR', receipt);

    // 2. Create Pending Transaction Record
    await this.transactionRepository.create({
      user: new Types.ObjectId(userId),
      amount,
      transactionType: TransactionType.CREDIT,
      transactionCategory: TransactionCategory.WALLET_TOPUP,
      status: TransactionStatus.PENDING,
      paymentGateway: PaymentGateway.RAZORPAY,
      gatewayOrderId: order.id,
      description: 'Wallet Topup',
    });

    return order;
  }

  /**
   * Verify Payment and Credit Wallet
   */
  async verifyTopupPayment(userId: string, orderId: string, paymentId: string, signature: string) {
    // 1. Verify Signature
    const isValid = RazorpayProvider.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      throw new ApiError('Invalid payment signature', httpStatus.BAD_REQUEST);
    }

    const session = await startSession();
    session.startTransaction();

    try {
      // 2. Find Transaction
      const transaction = await this.transactionRepository.findByGatewayOrderId(orderId);
      if (!transaction) {
        throw new ApiError('Transaction not found', httpStatus.NOT_FOUND);
      }

      if (transaction.status === TransactionStatus.SUCCESS) {
        return { message: 'Payment already verified' };
      }

      // 3. Update Transaction Status
      await this.transactionRepository.updateStatus(
        transaction._id as Types.ObjectId,
        TransactionStatus.SUCCESS,
        paymentId,
        signature,
        session
      );

      // 4. Credit Wallet
      await this.walletService.creditWallet(
        userId,
        transaction.amount,
        TransactionCategory.WALLET_TOPUP,
        'Wallet topup successful',
        { paymentId, orderId },
        session
      );

      await session.commitTransaction();
      return { message: 'Wallet topped up successfully' };
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Process Refund
   */
  async processRefund(transactionId: string, amount?: number, reason?: string) {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new ApiError('Transaction not found', httpStatus.NOT_FOUND);
    }


    if (transaction.status !== TransactionStatus.SUCCESS) {
      throw new ApiError('Only successful transactions can be refunded', httpStatus.BAD_REQUEST);
    }

    if (!transaction.gatewayPaymentId) {
      throw new ApiError('No gateway payment ID found for refund', httpStatus.BAD_REQUEST);
    }

    const session = await startSession();
    session.startTransaction();

    try {
      // 1. Initiate Razorpay Refund
      const refund = await RazorpayProvider.createRefund(transaction.gatewayPaymentId, amount);


      // 2. Create Refund Transaction Record
      const refundTransaction = await this.transactionRepository.create({
        user: transaction.user,
        amount: amount || transaction.amount,
        transactionType: TransactionType.REFUND,
        transactionCategory: TransactionCategory.CANCELLATION_REFUND,
        status: TransactionStatus.SUCCESS,
        paymentGateway: PaymentGateway.RAZORPAY,
        metadata: { originalTransactionId: transactionId, refundId: refund.id, reason },
        description: `Refund for transaction ${transactionId}`,
      }, session);

      // 3. Update Original Transaction Status (optional, or mark as partially/fully refunded)
      await this.transactionRepository.updateStatus(
        transaction._id as Types.ObjectId,
        TransactionStatus.REFUNDED,
        undefined,
        undefined,
        session
      );

      // 4. If it was a wallet topup, we might need to deduct from wallet? 
      // Usually refunds go back to the source (card/UPI), so wallet deduction is only if it was spent.
      // But if it was a ride payment from wallet, we credit the wallet.
      
      if (transaction.transactionCategory === TransactionCategory.RIDE_PAYMENT) {
        await this.walletService.creditWallet(
          transaction.user,
          amount || transaction.amount,
          TransactionCategory.CANCELLATION_REFUND,
          'Ride refund credited to wallet',
          { originalTransactionId: transactionId },
          session
        );
      }

      await session.commitTransaction();
      return refund;
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
