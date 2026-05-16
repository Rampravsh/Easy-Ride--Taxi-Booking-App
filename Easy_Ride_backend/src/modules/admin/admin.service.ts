import User from '../user/user.model';
import Rider from '../rider/rider.model';
import { VerificationStatus } from '../../shared/enums';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import { Audit } from '../audit/audit.model';
import {
  AuditAction, AuditStatus,
  NotificationType, DeliveryType, RecipientType,
  TransactionStatus, TransactionCategory, TransactionType, PaymentGateway,
} from '../../shared/enums';
import { Types } from 'mongoose';
import logger from '../../shared/utils/logger';
import { NotificationService } from '../notification/notification.service';
import { TransactionRepository } from '../transaction/transaction.repository';
import { RazorpayProvider } from '../payment/providers/razorpay.provider';

const notificationService = new NotificationService();
const transactionRepository = new TransactionRepository();

export class AdminService {
  /**
   * Verify a Rider's KYC documents
   */
  static async verifyRider(
    riderId: string,
    adminId: string,
    status: VerificationStatus,
    reason?: string
  ) {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new ApiError('Rider not found', httpStatus.NOT_FOUND);

    const previousStatus = rider.verificationStatus;
    rider.verificationStatus = status;
    await rider.save();

    // Audit the action
    await Audit.create({
      admin: new Types.ObjectId(adminId),
      action: AuditAction.RIDER_VERIFY,
      resource: 'rider',
      resourceId: riderId,
      previousState: { verificationStatus: previousStatus },
      newState: { verificationStatus: status },
      status: AuditStatus.SUCCESS,
      metadata: { reason },
    });

    // Notify the rider
    const notificationBody =
      status === VerificationStatus.APPROVED
        ? 'Congratulations! Your account has been verified. You can now start accepting rides.'
        : `Your verification was rejected. Reason: ${reason || 'Please contact support.'}`;

    notificationService
      .sendNotification({
        recipientId: riderId,
        recipientType: RecipientType.RIDER,
        title: `Verification ${status === VerificationStatus.APPROVED ? 'Approved' : 'Rejected'}`,
        body: notificationBody,
        notificationType: NotificationType.SYSTEM_ALERT,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { status },
      })
      .catch((err) => logger.error('Rider verification notification failed:', err));

    return rider;
  }

  /**
   * Block or unblock a user account
   */
  static async blockUser(
    userId: string,
    adminId: string,
    isBlocked: boolean,
    reason?: string
  ) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError('User not found', httpStatus.NOT_FOUND);

    const previousState = { isBlocked: user.isBlocked };
    user.isBlocked = isBlocked;
    await user.save();

    await Audit.create({
      admin: new Types.ObjectId(adminId),
      action: isBlocked ? AuditAction.USER_BLOCK : AuditAction.USER_UNBLOCK,
      resource: 'user',
      resourceId: userId,
      previousState,
      newState: { isBlocked },
      status: AuditStatus.SUCCESS,
      metadata: { reason },
    });

    return user;
  }

  /**
   * Block or unblock a rider account
   */
  static async blockRider(
    riderId: string,
    adminId: string,
    isBlocked: boolean,
    reason?: string
  ) {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new ApiError('Rider not found', httpStatus.NOT_FOUND);

    // Riders don't have isBlocked — use verificationStatus REJECTED as block mechanism
    // or add isBlocked to rider model (recommended future improvement)
    const previousStatus = rider.verificationStatus;
    if (isBlocked) {
      rider.verificationStatus = VerificationStatus.REJECTED;
      rider.isAvailable = false;
      rider.isOnline = false;
    }
    await rider.save();

    await Audit.create({
      admin: new Types.ObjectId(adminId),
      action: AuditAction.RIDER_BLOCK,
      resource: 'rider',
      resourceId: riderId,
      previousState: { verificationStatus: previousStatus },
      newState: { verificationStatus: rider.verificationStatus },
      status: AuditStatus.SUCCESS,
      metadata: { reason, isBlocked },
    });

    return rider;
  }

  /**
   * Process a manual refund for a transaction
   */
  static async processManualRefund(
    transactionId: string,
    adminId: string,
    amount?: number,
    reason?: string
  ) {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new ApiError('Transaction not found', httpStatus.NOT_FOUND);

    if (transaction.status !== TransactionStatus.SUCCESS) {
      throw new ApiError('Only successful transactions can be refunded', httpStatus.BAD_REQUEST);
    }

    let refundResult: any = { manual: true };

    // Attempt gateway refund if applicable
    if (transaction.gatewayPaymentId) {
      try {
        refundResult = await RazorpayProvider.createRefund(transaction.gatewayPaymentId, amount);
      } catch (err) {
        logger.warn('Gateway refund failed; recording manual refund', { transactionId });
      }
    }

    // Create refund transaction record
    const refundTransaction = await transactionRepository.create({
      user: transaction.user,
      amount: amount || transaction.amount,
      transactionType: TransactionType.REFUND,
      transactionCategory: TransactionCategory.CANCELLATION_REFUND,
      status: TransactionStatus.SUCCESS,
      paymentGateway: PaymentGateway.MANUAL,
      metadata: {
        originalTransactionId: transactionId,
        adminId,
        reason,
        refundId: refundResult?.id,
      },
      description: `Manual refund by admin for transaction ${transactionId}`,
    });

    await Audit.create({
      admin: new Types.ObjectId(adminId),
      action: AuditAction.REFUND_PROCESS,
      resource: 'transaction',
      resourceId: transactionId,
      previousState: { status: transaction.status },
      newState: { status: TransactionStatus.REFUNDED },
      status: AuditStatus.SUCCESS,
      metadata: { amount, reason },
    });

    return refundTransaction;
  }

  /**
   * Get audit logs with optional filters
   */
  static async getAuditLog(params: {
    page: number;
    limit: number;
    action?: string;
    resource?: string;
  }) {
    const { page, limit, action, resource } = params;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (action) filter.action = action;
    if (resource) filter.resource = resource;

    const [logs, total] = await Promise.all([
      Audit.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('admin', 'fullName email'),
      Audit.countDocuments(filter),
    ]);

    return {
      logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get Platform Statistics
   */
  static async getPlatformStats() {
    const [totalUsers, totalRiders, activeRiders] = await Promise.all([
      User.countDocuments(),
      Rider.countDocuments(),
      Rider.countDocuments({ isOnline: true }),
    ]);

    return {
      totalUsers,
      totalRiders,
      activeRiders,
    };
  }
}
