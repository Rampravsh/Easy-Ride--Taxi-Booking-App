import { Types } from 'mongoose';
import { Call } from './call.model';
import { ICall } from './call.interface';
import { CallStatus } from '../../shared/enums';

export class CallRepository {
  /**
   * Create a new call record
   */
  async createCall(data: Partial<ICall>) {
    return await Call.create(data);
  }

  /**
   * Find call by ID
   */
  async findById(id: string | Types.ObjectId) {
    return await Call.findById(id);
  }

  /**
   * Find active call by Twilio Room ID
   */
  async findByTwilioRoomId(twilioRoomId: string) {
    return await Call.findOne({ twilioRoomId, status: { $in: [CallStatus.INITIATED, CallStatus.RINGING, CallStatus.ACCEPTED] } });
  }

  /**
   * Update call status
   */
  async updateStatus(id: string | Types.ObjectId, status: CallStatus, extra: any = {}) {
    return await Call.findByIdAndUpdate(id, { status, ...extra }, { new: true });
  }

  /**
   * Get call history for a user
   */
  async getHistory(userId: string | Types.ObjectId, limit: number = 20, skip: number = 0) {
    return await Call.find({
      $or: [{ caller: userId }, { receiver: userId }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('ride', 'pickupLocation destinationLocation');
  }
}
