import Ride from './ride.model';
import { IRide } from './ride.interface';
import { RideStatus, PaymentStatus } from '../../shared/enums';

export class RideRepository {
  /**
   * Create a new ride
   */
  async create(rideData: Partial<IRide>): Promise<IRide> {
    return await Ride.create(rideData);
  }

  /**
   * Find ride by ID
   */
  async findById(id: string): Promise<IRide | null> {
    return await Ride.findById(id).populate('user rider vehicle');
  }

  /**
   * Update ride status and related fields
   */
  async updateStatus(
    id: string, 
    status: RideStatus, 
    extraData: Partial<IRide> = {}
  ): Promise<IRide | null> {
    return await Ride.findByIdAndUpdate(
      id,
      { $set: { status, ...extraData } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Assign rider to a ride
   */
  async assignRider(
    id: string, 
    riderId: string, 
    vehicleId: string
  ): Promise<IRide | null> {
    return await Ride.findByIdAndUpdate(
      id,
      { 
        $set: { 
          rider: riderId, 
          vehicle: vehicleId,
          status: RideStatus.ACCEPTED 
        } 
      },
      { new: true }
    );
  }

  /**
   * Find active ride for user or rider
   */
  async findActiveRide(userId: string, role: 'user' | 'rider'): Promise<IRide | null> {
    const query = role === 'user' ? { user: userId } : { rider: userId };
    return await Ride.findOne({
      ...query,
      status: { $in: [RideStatus.SEARCHING, RideStatus.ACCEPTED, RideStatus.ARRIVING, RideStatus.STARTED] },
    });
  }

  /**
   * Mark ride as paid
   */
  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<IRide | null> {
    return await Ride.findByIdAndUpdate(
      id,
      { $set: { paymentStatus: status } },
      { new: true }
    );
  }
}
