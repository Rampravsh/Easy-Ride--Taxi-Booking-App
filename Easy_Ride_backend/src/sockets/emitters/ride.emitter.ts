import { getIO } from '../../config/socket';
import { SOCKET_ROOMS, SocketEvents } from '../socket.constants';

export class RideEmitter {
  /**
   * Notify a rider about a new ride request
   */
  static emitRideRequested(riderId: string, rideData: any) {
    const io = getIO();
    io.to(SOCKET_ROOMS.RIDER(riderId)).emit(SocketEvents.RIDE_REQUESTED, rideData);
  }

  /**
   * Notify a user that their ride has been accepted
   */
  static emitRideAccepted(userId: string, rideData: any) {
    const io = getIO();
    io.to(SOCKET_ROOMS.USER(userId)).emit(SocketEvents.RIDE_ACCEPTED, rideData);
  }

  /**
   * Notify user that rider has arrived
   */
  static emitRideArrived(userId: string, rideData: any) {
    const io = getIO();
    io.to(SOCKET_ROOMS.USER(userId)).emit(SocketEvents.RIDE_ARRIVED, rideData);
  }

  /**
   * Notify all parties in the ride room about status changes
   */
  static emitRideStatusUpdate(rideId: string, status: string, data: any) {
    const io = getIO();
    io.to(SOCKET_ROOMS.RIDE(rideId)).emit(SocketEvents.RIDE_LOCATION_SYNC, {
      rideId,
      status,
      ...data,
    });
  }

  /**
   * Broadcast cancellation
   */
  static emitRideCancelled(rideId: string, reason: string) {
    const io = getIO();
    io.to(SOCKET_ROOMS.RIDE(rideId)).emit(SocketEvents.RIDE_CANCELLED, {
      rideId,
      reason,
    });
  }
}
