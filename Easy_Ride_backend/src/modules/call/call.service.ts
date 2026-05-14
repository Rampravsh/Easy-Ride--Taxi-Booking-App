import { Types } from 'mongoose';
import { CallRepository } from './call.repository';
import { TwilioProvider } from './providers/twilio.provider';
import { CallStatus, CallType } from '../../shared/enums';
import Ride from '../ride/ride.model';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import { getIO } from '../../config/socket';
import { SOCKET_ROOMS, SocketEvents } from '../../sockets/socket.constants';
import { v4 as uuidv4 } from 'uuid';

export class CallService {
  private repository: CallRepository;
  private twilio: TwilioProvider;

  constructor() {
    this.repository = new CallRepository();
    this.twilio = new TwilioProvider();
  }

  /**
   * Initiate a call
   */
  async initiateCall(params: {
    rideId: string;
    callerId: string;
    callType: CallType;
  }) {
    const { rideId, callerId, callType } = params;

    // 1. Validate ride and participants
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new ApiError('Ride not found', httpStatus.NOT_FOUND);
    }

    const isUser = ride.user.toString() === callerId;
    const isRider = ride.rider?.toString() === callerId;

    if (!isUser && !isRider) {
      throw new ApiError('You are not a participant in this ride', httpStatus.FORBIDDEN);
    }

    const receiverId = isUser ? ride.rider?.toString() : ride.user.toString();
    if (!receiverId) {
      throw new ApiError('Receiver not found', httpStatus.BAD_REQUEST);
    }

    // 2. Create Twilio Room
    const roomName = `ride_${rideId}_${uuidv4()}`;
    const room = await this.twilio.createRoom(roomName);

    // 3. Create Call Record
    const call = await this.repository.createCall({
      ride: new Types.ObjectId(rideId),
      caller: new Types.ObjectId(callerId),
      receiver: new Types.ObjectId(receiverId),
      callType,
      status: CallStatus.INITIATED,
      twilioRoomId: roomName,
      twilioSid: room.sid,
    });

    // 4. Generate Token for Caller
    const callerToken = this.twilio.generateToken(callerId, roomName);

    // 5. Emit Incoming Call to Receiver
    const io = getIO();
    io.to(SOCKET_ROOMS.USER(receiverId)).to(SOCKET_ROOMS.RIDER(receiverId)).emit(SocketEvents.CALL_INCOMING, {
      callId: call._id,
      callerId,
      callType,
      rideId,
      twilioRoomId: roomName,
    });

    return { call, token: callerToken };
  }

  /**
   * Accept a call
   */
  async acceptCall(callId: string, userId: string) {
    const call = await this.repository.findById(callId);
    if (!call) {
      throw new ApiError('Call not found', httpStatus.NOT_FOUND);
    }

    if (call.receiver.toString() !== userId) {
      throw new ApiError('You are not the receiver of this call', httpStatus.FORBIDDEN);
    }

    // Update status
    await this.repository.updateStatus(callId, CallStatus.ACCEPTED, { startedAt: new Date() });

    // Generate Token for Receiver
    const token = this.twilio.generateToken(userId, call.twilioRoomId!);

    // Emit to Caller
    const io = getIO();
    io.to(SOCKET_ROOMS.USER(call.caller.toString())).to(SOCKET_ROOMS.RIDER(call.caller.toString())).emit(SocketEvents.CALL_ACCEPTED, { callId });

    return { token };
  }

  /**
   * Reject a call
   */
  async rejectCall(callId: string, userId: string) {
    const call = await this.repository.findById(callId);
    if (!call || call.receiver.toString() !== userId) {
      throw new ApiError('Unauthorized', httpStatus.FORBIDDEN);
    }

    await this.repository.updateStatus(callId, CallStatus.REJECTED);

    // Emit to Caller
    const io = getIO();
    io.to(SOCKET_ROOMS.USER(call.caller.toString())).to(SOCKET_ROOMS.RIDER(call.caller.toString())).emit(SocketEvents.CALL_REJECTED, { callId });
  }

  /**
   * End a call
   */
  async endCall(callId: string) {
    const call = await this.repository.findById(callId);
    if (!call) return;

    const endedAt = new Date();
    const duration = call.startedAt ? Math.floor((endedAt.getTime() - call.startedAt.getTime()) / 1000) : 0;

    await this.repository.updateStatus(callId, CallStatus.ENDED, { endedAt, duration });

    // Close Twilio Room
    if (call.twilioSid) {
      await this.twilio.endRoom(call.twilioSid);
    }

    // Emit to both
    const io = getIO();
    const participants = [call.caller.toString(), call.receiver.toString()];
    participants.forEach(pid => {
      io.to(SOCKET_ROOMS.USER(pid)).to(SOCKET_ROOMS.RIDER(pid)).emit(SocketEvents.CALL_ENDED, { callId, duration });
    });
  }

  /**
   * Get call history
   */
  async getHistory(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return await this.repository.getHistory(userId, limit, skip);
  }
}
