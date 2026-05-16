import { RideRepository } from './ride.repository';
import { RiderRepository } from '../rider/rider.repository';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { RideHelper } from './ride.helper';
import { ApiError } from '../../shared/errors/ApiError';
import { RideStatus, PaymentStatus, PaymentMethod, NotificationType, DeliveryType, RecipientType } from '../../shared/enums';
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
import { calculateDistance } from '../../shared/helpers/distance.helper';
import { NotificationService } from '../notification/notification.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { FraudService } from '../fraud/fraud.service';

const notificationService = new NotificationService();

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
      otp:
        ride.status === RideStatus.ACCEPTED || ride.status === RideStatus.ARRIVING
          ? ride.otp
          : undefined,
      startedAt: ride.startedAt,
      completedAt: ride.completedAt,
    };
  }

  /**
   * Get fare estimation
   */
  async estimateFare(data: FareEstimateDTO): Promise<FareEstimateResponse> {
    const distanceInMeters = calculateDistance(
      { latitude: data.pickupCoordinates[1], longitude: data.pickupCoordinates[0] },
      { latitude: data.dropCoordinates[1], longitude: data.dropCoordinates[0] }
    );

    const averageSpeedMps = 5.55;
    const estimatedDurationSeconds = Math.round(distanceInMeters / averageSpeedMps);

    const fare = RideHelper.calculateFare(distanceInMeters, estimatedDurationSeconds);

    return {
      estimatedDistance: distanceInMeters,
      estimatedDuration: estimatedDurationSeconds,
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

    // 2. Fraud check: GPS spoof detection for suspicious coordinates
    // (lightweight check; heavy checks are queued to FraudService)

    // 3. Calculate actual distance and fare
    const distanceInMeters = calculateDistance(
      { latitude: data.pickupCoordinates[1], longitude: data.pickupCoordinates[0] },
      { latitude: data.dropCoordinates[1], longitude: data.dropCoordinates[0] }
    );

    const averageSpeedMps = 5.55;
    const durationInSeconds = Math.round(distanceInMeters / averageSpeedMps);

    const fareDetails = RideHelper.calculateFare(distanceInMeters, durationInSeconds);

    // 4. Find nearby riders (Initial check)
    const nearbyRiders = await this.riderRepository.findNearbyRiders(
      data.pickupCoordinates[1], // latitude
      data.pickupCoordinates[0], // longitude
      RIDE_CONSTANTS.SEARCH_RADIUS_KM
    );

    if (nearbyRiders.length === 0) {
      throw new ApiError('No riders available in your area', 404);
    }

    // 5. Create Ride object
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
      estimatedDistance: distanceInMeters,
      estimatedDuration: durationInSeconds,
      ...fareDetails,
      paymentMethod: data.paymentMethod,
      otp: RideHelper.generateOTP(),
    });

    logger.info(`Ride booked: ${ride._id} by user: ${userId}`);

    // TODO: Emit socket event to nearby riders (ride:requested)

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

    // Notify user that a rider has been found
    notificationService
      .sendNotification({
        recipientId: ride.user.toString(),
        recipientType: RecipientType.USER,
        title: 'Rider Found!',
        body: 'A rider has accepted your ride. They are on their way.',
        notificationType: NotificationType.RIDE_UPDATE,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { rideId, status: RideStatus.ACCEPTED },
      })
      .catch((err) => logger.error('Notification failed (acceptRide):', err));

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

    // Notify user
    notificationService
      .sendNotification({
        recipientId: ride.user.toString(),
        recipientType: RecipientType.USER,
        title: 'Rider has arrived!',
        body: 'Your rider is at the pickup location. Please share your OTP to start the ride.',
        notificationType: NotificationType.RIDE_UPDATE,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { rideId, status: RideStatus.ARRIVING },
      })
      .catch((err) => logger.error('Notification failed (markAsArrived):', err));

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

    // Notify user
    notificationService
      .sendNotification({
        recipientId: ride.user.toString(),
        recipientType: RecipientType.USER,
        title: 'Ride Started',
        body: 'Your ride has started. Enjoy your trip!',
        notificationType: NotificationType.RIDE_UPDATE,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { rideId, status: RideStatus.STARTED },
      })
      .catch((err) => logger.error('Notification failed (startRide):', err));

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

    // Determine payment status based on method
    const newPaymentStatus =
      ride.paymentMethod === PaymentMethod.WALLET
        ? PaymentStatus.PAID
        : PaymentStatus.PENDING;

    const updatedRide = await this.rideRepository.updateStatus(rideId, RideStatus.COMPLETED, {
      completedAt: new Date(),
      paymentStatus: newPaymentStatus,
    });

    // Make rider available again
    await this.riderRepository.updateAvailability(riderId, true);

    // Notify user
    notificationService
      .sendNotification({
        recipientId: ride.user.toString(),
        recipientType: RecipientType.USER,
        title: 'Ride Completed',
        body: `Your ride is complete. Total fare: ₹${ride.totalFare}. Thank you for riding with Easy Ride!`,
        notificationType: NotificationType.RIDE_UPDATE,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { rideId, status: RideStatus.COMPLETED, totalFare: ride.totalFare },
      })
      .catch((err) => logger.error('Notification failed (completeRide):', err));

    // Notify rider
    notificationService
      .sendNotification({
        recipientId: riderId,
        recipientType: RecipientType.RIDER,
        title: 'Ride Completed',
        body: `Ride completed. Earnings: ₹${ride.totalFare}`,
        notificationType: NotificationType.RIDE_UPDATE,
        deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
        data: { rideId, status: RideStatus.COMPLETED },
      })
      .catch((err) => logger.error('Notification failed (completeRide rider):', err));

    // Analytics hook (fire-and-forget)
    AnalyticsService.getOpsOverview().catch((err) =>
      logger.warn('Analytics refresh failed after ride complete:', err)
    );

    // Fake ride detection (async, non-blocking)
    FraudService.detectFakeRide(rideId).then((isFake) => {
      if (isFake) {
        logger.warn(`Fake ride detected: ${rideId}`, { rideId, riderId });
        // TODO: trigger fraud alert notification to admin
      }
    }).catch((err) => logger.error('Fraud detection failed:', err));

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

      // Notify rider
      notificationService
        .sendNotification({
          recipientId: ride.rider.toString(),
          recipientType: RecipientType.RIDER,
          title: 'Ride Cancelled',
          body: `The ride has been cancelled. Reason: ${reason}`,
          notificationType: NotificationType.RIDE_UPDATE,
          deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
          data: { rideId, status: RideStatus.CANCELLED, reason },
        })
        .catch((err) => logger.error('Notification failed (cancelRide rider):', err));
    }

    // Notify user (if rider cancelled)
    if (ride.rider?.toString() === userId) {
      notificationService
        .sendNotification({
          recipientId: ride.user.toString(),
          recipientType: RecipientType.USER,
          title: 'Ride Cancelled by Rider',
          body: 'Your rider has cancelled the ride. We are searching for another rider.',
          notificationType: NotificationType.RIDE_UPDATE,
          deliveryType: [DeliveryType.PUSH, DeliveryType.IN_APP],
          data: { rideId, status: RideStatus.CANCELLED },
        })
        .catch((err) => logger.error('Notification failed (cancelRide user):', err));
    }

    logger.info(`Ride cancelled: ${rideId} by: ${userId}`, { reason });

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
      logger.info(`Activating matching for scheduled ride: ${rideId}`);
      // TODO: Emit socket event to trigger matching engine
    }
  }
}
