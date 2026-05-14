import { RideRepository } from './ride.repository';
import { RiderRepository } from '../rider/rider.repository';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { RideHelper } from './ride.helper';
import { ApiError } from '../../shared/errors/ApiError';
import { RideStatus, PaymentStatus } from '../../shared/enums';
import { 
  FareEstimateDTO, 
  FareEstimateResponse, 
  BookRideDTO, 
  RideResponse,
  AcceptRideDTO 
} from './ride.types';
import { IRide } from './ride.interface';
import { RIDE_CONSTANTS } from './ride.constants';
import logger from '../../shared/utils/logger';


export class RideService {
  private rideRepository: RideRepository;
  private riderRepository: RiderRepository;
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.rideRepository = new RideRepository();
    this.riderRepository = new RiderRepository();
    this.vehicleRepository = new VehicleRepository();
  }

  /**
   * Format ride for response
   */
  private formatRideResponse(ride: IRide): RideResponse {
    return {
      id: ride._id.toString(),
      user: ride.user.toString(),
      rider: ride.rider?.toString(),
      vehicle: ride.vehicle?.toString(),
      status: ride.status,
      pickupLocation: {
        address: ride.pickupLocation.address,
        coordinates: ride.pickupLocation.coordinates,
      },
      dropLocation: {
        address: ride.dropLocation.address,
        coordinates: ride.dropLocation.coordinates,
      },
      totalFare: ride.totalFare,
      paymentMethod: ride.paymentMethod,
      paymentStatus: ride.paymentStatus,
      otp: ride.status === RideStatus.ACCEPTED || ride.status === RideStatus.ARRIVING ? ride.otp : undefined,
      startedAt: ride.startedAt,
      completedAt: ride.completedAt,
    };
  }

  /**
   * Get fare estimation
   */
  async estimateFare(data: FareEstimateDTO): Promise<FareEstimateResponse> {
    // For now, using a mock distance calculation or just random values
    // In real app, we would use Google Maps Matrix API or similar
    const mockDistanceInMeters = 5000; // 5km
    const mockDurationInSeconds = 900; // 15 mins

    const fare = RideHelper.calculateFare(mockDistanceInMeters, mockDurationInSeconds);

    return {
      estimatedDistance: mockDistanceInMeters,
      estimatedDuration: mockDurationInSeconds,
      ...fare,
    };
  }

  /**
   * Book a ride
   */
  async bookRide(userId: string, data: BookRideDTO): Promise<RideResponse> {
    // 1. Check if user already has an active ride
    const activeRide = await this.rideRepository.findActiveRide(userId, 'user');
    if (activeRide) {
      throw new ApiError('You already have an active ride request', 400);
    }

    // 2. Calculate fare (re-calculate for security)
    const mockDistance = 5000; 
    const mockDuration = 900;
    const fareDetails = RideHelper.calculateFare(mockDistance, mockDuration);

    // 3. Find nearby riders (Initial check)
    const nearbyRiders = await this.riderRepository.findNearbyRiders(
      data.pickupCoordinates[1], // latitude
      data.pickupCoordinates[0], // longitude
      RIDE_CONSTANTS.SEARCH_RADIUS_KM
    );

    if (nearbyRiders.length === 0) {
      throw new ApiError('No riders available in your area', 404);
    }

    // 4. Create Ride object
    const ride = await this.rideRepository.create({
      user: userId as any,
      rideType: data.rideType,
      rideCategory: data.rideCategory,
      status: RideStatus.SEARCHING,
      pickupLocation: {
        type: 'Point',
        coordinates: data.pickupCoordinates,
        address: data.pickupAddress,
      },
      dropLocation: {
        type: 'Point',
        coordinates: data.dropCoordinates,
        address: data.dropAddress,
      },
      estimatedDistance: mockDistance,
      estimatedDuration: mockDuration,
      ...fareDetails,
      paymentMethod: data.paymentMethod,
      otp: RideHelper.generateOTP(),
    });

    // TODO: Emit socket event to nearby riders

    return this.formatRideResponse(ride);
  }

  /**
   * Accept a ride (Rider only)
   */
  async acceptRide(riderId: string, rideId: string, data: AcceptRideDTO): Promise<RideResponse> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride) throw new ApiError('Ride not found', 404);

    if (ride.status !== RideStatus.SEARCHING) {
      throw new ApiError('Ride is no longer available', 400);
    }

    // Verify vehicle belongs to rider and is active/verified
    const vehicle = await this.vehicleRepository.findById(data.vehicleId);
    if (!vehicle || vehicle.rider.toString() !== riderId || !vehicle.isActive) {
      throw new ApiError('Invalid or inactive vehicle selected', 400);
    }

    const updatedRide = await this.rideRepository.assignRider(rideId, riderId, data.vehicleId);
    
    // Set rider to unavailable
    await this.riderRepository.updateAvailability(riderId, false);

    return this.formatRideResponse(updatedRide!);
  }

  /**
   * Mark rider as arrived at pickup location
   */
  async markAsArrived(riderId: string, rideId: string): Promise<RideResponse> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride || ride.rider?.toString() !== riderId) {
      throw new ApiError('Unauthorized or ride not found', 403);
    }

    if (!RideHelper.isValidTransition(ride.status, RideStatus.ARRIVING)) {
      throw new ApiError(`Invalid transition from ${ride.status} to arriving`, 400);
    }

    const updatedRide = await this.rideRepository.updateStatus(rideId, RideStatus.ARRIVING);
    return this.formatRideResponse(updatedRide!);
  }

  /**
   * Start ride (requires OTP)
   */
  async startRide(riderId: string, rideId: string, otp: string): Promise<RideResponse> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride || ride.rider?.toString() !== riderId) {
      throw new ApiError('Unauthorized', 403);
    }

    if (ride.otp !== otp) {
      throw new ApiError('Invalid OTP', 400);
    }

    if (!RideHelper.isValidTransition(ride.status, RideStatus.STARTED)) {
      throw new ApiError('Cannot start ride in current status', 400);
    }

    const updatedRide = await this.rideRepository.updateStatus(rideId, RideStatus.STARTED, {
      startedAt: new Date(),
    });

    return this.formatRideResponse(updatedRide!);
  }

  /**
   * Complete ride
   */
  async completeRide(riderId: string, rideId: string): Promise<RideResponse> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride || ride.rider?.toString() !== riderId) {
      throw new ApiError('Unauthorized', 403);
    }

    if (!RideHelper.isValidTransition(ride.status, RideStatus.COMPLETED)) {
      throw new ApiError('Cannot complete ride in current status', 400);
    }

    const updatedRide = await this.rideRepository.updateStatus(rideId, RideStatus.COMPLETED, {
      completedAt: new Date(),
      paymentStatus: ride.paymentMethod === 'wallet' ? PaymentStatus.PAID : PaymentStatus.PENDING,
    });

    // Make rider available again
    await this.riderRepository.updateAvailability(riderId, true);

    return this.formatRideResponse(updatedRide!);
  }

  /**
   * Cancel ride
   */
  async cancelRide(userId: string, rideId: string, reason: string): Promise<RideResponse> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride) throw new ApiError('Ride not found', 404);

    // Only user or rider can cancel
    if (ride.user.toString() !== userId && ride.rider?.toString() !== userId) {
      throw new ApiError('Unauthorized', 403);
    }

    if (!RideHelper.isValidTransition(ride.status, RideStatus.CANCELLED)) {
      throw new ApiError('Ride cannot be cancelled in its current state', 400);
    }

    const updatedRide = await this.rideRepository.updateStatus(rideId, RideStatus.CANCELLED, {
      cancelledAt: new Date(),
      cancelledBy: userId as any,
      cancellationReason: reason,
    });

    // If rider was assigned, make them available again
    if (ride.rider) {
      await this.riderRepository.updateAvailability(ride.rider.toString(), true);
    }

    return this.formatRideResponse(updatedRide!);
  }

  /**
   * Get ride details
   */
  async getRideDetails(rideId: string): Promise<RideResponse> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride) throw new ApiError('Ride not found', 404);
    return this.formatRideResponse(ride);
  }

  /**
   * Activate a scheduled ride (start matching)
   */
  async activateScheduledRide(rideId: string): Promise<void> {
    const ride = await this.rideRepository.findById(rideId);
    if (!ride) return;

    if (ride.status === RideStatus.SEARCHING) {
      // Logic for triggering matching process
      logger.info(`Activating matching for scheduled ride: ${rideId}`);
    }
  }
}

