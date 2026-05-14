import User from '../user/user.model';
import Rider from '../rider/rider.model';
import { VerificationStatus } from '../rider/rider.interface';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import { Audit } from '../audit/audit.model';
import { AuditAction, AuditStatus } from '../../shared/enums';
import { Types } from 'mongoose';

export class AdminService {
  /**
   * Verify a Rider
   */
  static async verifyRider(riderId: string, adminId: string, status: VerificationStatus, reason?: string) {
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

    return rider;
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
