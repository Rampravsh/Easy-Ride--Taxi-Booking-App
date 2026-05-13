import Ride, { IRide } from './ride.model';
import { RiderService } from '../rider/rider.service';
import { RideStatus } from '../../shared/enums';
import { ApiError } from '../../shared/errors/ApiError';

export class RideService {
  private riderService: RiderService;

  constructor() {
    this.riderService = new RiderService();
  }

  async requestRide(userId: string, rideData: any) {
    // 1. Create a pending ride
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ride = await Ride.create({
      ...rideData,
      user: userId,
      otp,
      status: RideStatus.PENDING,
    });

    // 2. Find nearby online riders
    const nearbyRiders = await this.riderService.getOnlineRiders(
      rideData.pickupLocation.coordinates
    );

    // 3. Notify riders (this would normally use sockets/FCM)
    // For now, we just return the ride and the number of riders found
    return { ride, nearbyRidersCount: nearbyRiders.length };
  }

  async acceptRide(rideId: string, riderId: string) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new ApiError('Ride not found', 404);
    if (ride.status !== RideStatus.PENDING) {
      throw new ApiError('Ride is no longer available', 400);
    }

    ride.rider = riderId as any;
    ride.status = RideStatus.ACCEPTED;
    await ride.save();

    return ride;
  }

  async startRide(rideId: string, otp: string) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new ApiError('Ride not found', 404);
    if (ride.otp !== otp) throw new ApiError('Invalid OTP', 400);

    ride.status = RideStatus.STARTED;
    ride.startedAt = new Date();
    await ride.save();

    return ride;
  }

  async completeRide(rideId: string) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new ApiError('Ride not found', 404);

    ride.status = RideStatus.COMPLETED;
    ride.completedAt = new Date();
    await ride.save();

    return ride;
  }
}
