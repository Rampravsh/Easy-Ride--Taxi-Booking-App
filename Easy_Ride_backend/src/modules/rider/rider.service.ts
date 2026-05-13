import { RiderRepository } from './rider.repository';
import { ApiError } from '../../shared/errors/ApiError';
import { 
  UpdateRiderProfileDTO, 
  UpdateLocationDTO, 
  RiderProfileResponse,
  RiderEarningsResponse 
} from './rider.types';
import { IRider } from './rider.interface';

export class RiderService {
  private riderRepository: RiderRepository;

  constructor() {
    this.riderRepository = new RiderRepository();
  }

  /**
   * Format rider object for response
   */
  private formatRiderResponse(rider: IRider): RiderProfileResponse {
    return {
      id: rider._id.toString(),
      firebaseUID: rider.firebaseUID,
      fullName: rider.fullName,
      email: rider.email,
      phone: rider.phone,
      profileImage: rider.profileImage,
      isOnline: rider.isOnline,
      isAvailable: rider.isAvailable,
      verificationStatus: rider.verificationStatus,
      currentLocation: rider.currentLocation,
      averageRating: rider.averageRating,
      totalEarnings: rider.totalEarnings,
      totalTrips: rider.totalTrips,
      walletBalance: rider.walletBalance,
    };
  }

  /**
   * Get rider profile
   */
  async getProfile(riderId: string): Promise<RiderProfileResponse> {
    const rider = await this.riderRepository.findById(riderId);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return this.formatRiderResponse(rider);
  }

  /**
   * Update rider profile
   */
  async updateProfile(riderId: string, updateData: UpdateRiderProfileDTO): Promise<RiderProfileResponse> {
    const rider = await this.riderRepository.updateProfile(riderId, updateData);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return this.formatRiderResponse(rider);
  }

  /**
   * Update live location
   */
  async updateLocation(riderId: string, locationData: UpdateLocationDTO): Promise<RiderProfileResponse> {
    const rider = await this.riderRepository.updateLocation(riderId, locationData);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return this.formatRiderResponse(rider);
  }

  /**
   * Update online status
   */
  async updateStatus(riderId: string, isOnline: boolean): Promise<RiderProfileResponse> {
    const rider = await this.riderRepository.updateStatus(riderId, isOnline);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return this.formatRiderResponse(rider);
  }

  /**
   * Update availability
   */
  async updateAvailability(riderId: string, isAvailable: boolean): Promise<RiderProfileResponse> {
    const rider = await this.riderRepository.updateAvailability(riderId, isAvailable);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return this.formatRiderResponse(rider);
  }

  /**
   * Get earnings info
   */
  async getEarnings(riderId: string): Promise<RiderEarningsResponse> {
    const rider = await this.riderRepository.findById(riderId);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return {
      totalEarnings: rider.totalEarnings,
      totalTrips: rider.totalTrips,
      walletBalance: rider.walletBalance,
    };
  }

  /**
   * Update device token
   */
  async updateDeviceToken(riderId: string, token: string): Promise<RiderProfileResponse> {
    const rider = await this.riderRepository.addDeviceToken(riderId, token);
    if (!rider) {
      throw new ApiError('Rider not found', 404);
    }
    return this.formatRiderResponse(rider);
  }
}
