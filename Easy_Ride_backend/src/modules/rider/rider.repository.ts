import Rider from './rider.model';
import { IRider, VerificationStatus } from './rider.interface';
import { UpdateRiderProfileDTO, UpdateLocationDTO } from './rider.types';

export class RiderRepository {
  /**
   * Find rider by ID
   */
  async findById(id: string): Promise<IRider | null> {
    return await Rider.findById(id);
  }

  /**
   * Find rider by Firebase UID
   */
  async findByFirebaseUID(firebaseUID: string): Promise<IRider | null> {
    return await Rider.findOne({ firebaseUID });
  }

  /**
   * Update rider profile
   */
  async updateProfile(id: string, updateData: UpdateRiderProfileDTO): Promise<IRider | null> {
    return await Rider.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update live location
   */
  async updateLocation(id: string, location: UpdateLocationDTO): Promise<IRider | null> {
    return await Rider.findByIdAndUpdate(
      id,
      {
        $set: {
          currentLocation: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          lastActive: new Date(),
        },
      },
      { new: true }
    );
  }

  /**
   * Update online status
   */
  async updateStatus(id: string, isOnline: boolean): Promise<IRider | null> {
    return await Rider.findByIdAndUpdate(
      id,
      { 
        $set: { 
          isOnline,
          // If going offline, also make unavailable
          ...(isOnline === false ? { isAvailable: false } : {})
        } 
      },
      { new: true }
    );
  }

  /**
   * Update availability
   */
  async updateAvailability(id: string, isAvailable: boolean): Promise<IRider | null> {
    return await Rider.findByIdAndUpdate(
      id,
      { $set: { isAvailable } },
      { new: true }
    );
  }

  /**
   * Add device token
   */
  async addDeviceToken(id: string, token: string): Promise<IRider | null> {
    return await Rider.findByIdAndUpdate(
      id,
      { $addToSet: { deviceTokens: token } },
      { new: true }
    );
  }

  /**
   * Find nearby available riders
   */
  async findNearbyRiders(
    longitude: number,
    latitude: number,
    radiusInKm: number = 5,
    limit: number = 10
  ): Promise<IRider[]> {
    return await Rider.find({
      isOnline: true,
      isAvailable: true,
      verificationStatus: VerificationStatus.APPROVED,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInKm * 1000, // MongoDB uses meters
        },
      },
    }).limit(limit);
  }

  /**
   * Update wallet and earnings
   */
  async updateEarnings(id: string, amount: number): Promise<IRider | null> {
    return await Rider.findByIdAndUpdate(
      id,
      {
        $inc: {
          walletBalance: amount,
          totalEarnings: amount,
          totalTrips: 1,
        },
      },
      { new: true }
    );
  }
}
